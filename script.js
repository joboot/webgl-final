var plane, wall, player, body, head, limb, playerLeg1, arm, tabletop, leg1, cube1, pedestal1,
scene, camera, renderer, controls, theta;
var birdMixer, birdMixer2, birdMixer3;
var characterMixer;
var camera;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var clock = new THREE.Clock();
var listener = new THREE.AudioListener();
var sound = new THREE.Audio( listener );
scene = new THREE.Scene();
player = new THREE.Group();

init();

function init() {

  lighting();
  addObjects();
  loadModels();
  cameras();
  utils();
  addSound();
  animate();

};

function addSound() {
  camera.add( listener );

  var audioLoader = new THREE.AudioLoader();

  //Load a sound and set it as the Audio object's buffer
  audioLoader.load( 'sounds/outdoors.ogg', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop(true);
    sound.setVolume(2);
    },
  );
}

function utils() {
  //create renderer and set size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0,0,0);
  controls.update();

  addKeyboardControl();

  window.addEventListener('resize', resize, false);
  document.addEventListener('click', onDocumentMouseDown, false);
  animate();
}

function addKeyboardControl(){
  //listens for input
  document.addEventListener('click', onDocumentMouseDown);
  document.addEventListener( 'keydown', keyDown );
  document.addEventListener( 'keyup', keyUp );
}

function keyDown(evt){
  //player movement forward and turning
    let forward = (player.userData!==undefined && player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.userData!=undefined && player.userData.move!==undefined) ?  player.userData.move.turn : 0;

    //keymapping what the keys do
    switch(evt.keyCode){
      case 87://W
        forward = -1;
        break;
      case 83://S
        forward = 1;
        break;
      case 65://A
        turn = 1;
        break;
      case 68://D
        turn = -1;
        break;
    }

    playerControl(forward, turn);
}

function keyUp(evt){
    let forward = (player.userData!==undefined && player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.move!=undefined && player.userData.move!==undefined) ?  player.userData.move.turn : 0;

    switch(evt.keyCode){
      case 87://W
        forward = 0;
        break;
      case 83://S
        forward = 0;
        break;
      case 65://A
        turn = 0;
        break;
      case 68://D
        turn = 0;
        break;
    }

    playerControl(forward, turn);
}

function playerControl(forward, turn){
  //if player is not inputting, do not move
   	if (forward==0 && turn==0){
			delete player.userData.move;
		}else{
      if (player.userData===undefined) player.userData = {};
			this.player.userData.move = { forward, turn };
		}
}

function onDocumentMouseDown(event) {
  event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(doorGroup.children);
	if (intersects.length > 0) {
		doorGroup.rotation.y -= 2;
    sound.play();
	}
}

function cameras() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  //set camera up
  camera.position.set(0, 5, 7);
  camera.lookAt(0,7,0)

  //camera array if i wanted to have multiple in the future
  cameras = [];
  cameraIndex = 0;

  //camera that follows the player
  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);
}

function lighting() {
  //add subtle ambient lighting
  const ambientLight = new THREE.AmbientLight(0x353535);
  scene.add(ambientLight);

  //add a pointlight
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0, 11.5, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
}

function loadModels() {
  const loader = new THREE.GLTFLoader();
  loader.load(
    'resources/sci-fi_male_character/scene.gltf',

    function ( character ){
      character.scene.position.set(0, .7,0);
      character.scene.scale.set(.025,.03,.025)
      character.scene.rotation.y = 135.2;
      characterMixer = new THREE.AnimationMixer(character.scene);
      var action = characterMixer.clipAction(character.animations[7]);
      action.play();
      player.add(character.scene);
    }
  )
  loader.load(
  	// resource URL
  	'resources/simple_bird/scene.gltf',
  	// called when the resource is loaded
  	function ( bird ) {
      bird.scene.position.set(6, 2,12);
      bird.scene.rotation.y = 0.6 * Math.PI;
      birdMixer = new THREE.AnimationMixer(bird.scene);
      var fly = birdMixer.clipAction(bird.animations[0]);
      fly.play();
  		birdGroup1.add( bird.scene );
    }
  )
    loader.load(
    	// resource URL
    	'resources/simple_bird/scene.gltf',
    	// called when the resource is loaded
    	function ( bird2 ) {
        bird2.scene.position.set(3, 2,9);
        bird2.scene.rotation.y = 0.6 * Math.PI;
        birdMixer2= new THREE.AnimationMixer(bird2.scene);
        var fly = birdMixer2.clipAction(bird2.animations[0]);
        fly.play();
    		birdGroup1.add( bird2.scene );
      }
    )
    loader.load(
    	// resource URL
    	'resources/simple_bird/scene.gltf',
    	// called when the resource is loaded
    	function ( bird3 ) {
        bird3.scene.position.set(3, 2,15);
        bird3.scene.rotation.y = 0.6 * Math.PI;
        birdMixer3= new THREE.AnimationMixer(bird3.scene);
        var fly = birdMixer3.clipAction(bird3.animations[0]);
        fly.play();
    		birdGroup1.add( bird3.scene );
      }
    )
}

function addObjects() {
  //texture asset path
  const assetPath = './textures/';

  //textures used
  const stonetiles = new THREE.TextureLoader().load(`${assetPath}stonetiles.png`);
  const wood2 = new THREE.TextureLoader().load(`${assetPath}wood2.png`);
  const brown = new THREE.TextureLoader().load(`${assetPath}brown_paper.jpg`);
  const wood1 = new THREE.TextureLoader().load(`${assetPath}wood1.jpg`);
  const crate1 = new THREE.TextureLoader().load(`${assetPath}crate1.png`);
  const crate2 = new THREE.TextureLoader().load(`${assetPath}crate2.png`);
  const fire = new THREE.TextureLoader().load(`${assetPath}fire.jpg`);
  const pavingstone = new THREE.TextureLoader().load(`${assetPath}pavingstone.png`);
  const metal = new THREE.TextureLoader().load(`${assetPath}metal.jpg`);

  //cubemap textures
  const cubemap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}/cubemap/`)
      .load([
              'zeus_ft.jpg',
              'zeus_bk.jpg',
              'zeus_up.jpg',
              'zeus_dn.jpg',
              'zeus_rt.jpg',
              'zeus_lf.jpg'
      ]);

  scene.background = cubemap;

  birdGroup1 = new THREE.Group();
  birdGroup1.position.set(-15, 0, -65)
  scene.add(birdGroup1)

  //floor and walls
  const floorGeometry1 = new THREE.PlaneGeometry(20, 20);
  const floorMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: stonetiles, alphaMap: stonetiles,
    transparent: false, side: THREE.DoubleSide });
  floor1 = new THREE.Mesh(floorGeometry1, floorMaterial1);
  floor1.receiveShadow = true;
  floor1.rotation.x = -0.5 * Math.PI;
  floor1.position.set(0, 0, 0);
  scene.add(floor1);

  const floorGeometry2 = new THREE.PlaneGeometry(6, 15);
  const floorMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: stonetiles, alphaMap: stonetiles,
    transparent: false, side: THREE.DoubleSide });
  floor2 = new THREE.Mesh(floorGeometry2, floorMaterial2);
  floor2.receiveShadow = true;
  floor2.rotation.x = -0.5 * Math.PI;
  floor2.position.set(0, 0, -17.5);
  scene.add(floor2);

  const floorGeometry3 = new THREE.PlaneGeometry(20, 15);
  const floorMaterial3 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: stonetiles, alphaMap: stonetiles,
    transparent: false, side: THREE.DoubleSide });
  floor3 = new THREE.Mesh(floorGeometry3, floorMaterial3);
  floor3.receiveShadow = true;
  floor3.rotation.x = -0.5 * Math.PI;
  floor3.position.set(0, 0, -32.5);
  scene.add(floor3);

  const ceilingGeometry1 = new THREE.BoxGeometry(20,20,.1);
  const ceilingMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: stonetiles, alphaMap: stonetiles,
    transparent: false, side: THREE.DoubleSide });
  ceiling1 = new THREE.Mesh(ceilingGeometry1, ceilingMaterial1);
  ceiling1.receiveShadow = true;
  ceiling1.rotation.x = -0.5 * Math.PI;
  ceiling1.position.set(0, 10, 0);
  scene.add(ceiling1);

  const ceilingGeometry2 = new THREE.BoxGeometry(6,15,.1);
  const ceilingMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: stonetiles, alphaMap: stonetiles,
    transparent: false, side: THREE.DoubleSide });
  ceiling2 = new THREE.Mesh(ceilingGeometry2, ceilingMaterial2);
  ceiling2.receiveShadow = true;
  ceiling2.rotation.x = -0.5 * Math.PI;
  ceiling2.position.set(0, 8, -17.5);
  scene.add(ceiling2);

  walls = new THREE.Group();

  const wallGeometry1 = new THREE.BoxGeometry(20, 10, .3);
  const wallMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: wood2, alphaMap: wood2,
    transparent: false, side: THREE.DoubleSide });
  wall1 = new THREE.Mesh(wallGeometry1, wallMaterial1);
  wall1.receiveShadow = true;
  wall1.position.set(0, 5, 10);

  const wall2 = wall1.clone();
  wall2.position.set(10, 5, 0);
  wall2.rotation.y = .5 * Math.PI;
  const wall3 = wall1.clone();
  wall3.position.set(-10, 5, 0);
  wall3.rotation.y = .5 * Math.PI;

  const wallGeometry2 = new THREE.BoxGeometry(8, 10, .3);
  const wallMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: wood2, alphaMap: wood2,
    transparent: false, side: THREE.DoubleSide });
  wall4 = new THREE.Mesh(wallGeometry2, wallMaterial2);
  wall4.receiveShadow = true;
  wall4.position.set(6, 5, -10);

  const wall5 = wall4.clone();
  wall5.position.set(-6, 5, -10);

  const wallGeometry3 = new THREE.BoxGeometry(4, 4, .3);
  const wallMaterial3 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: wood2, alphaMap: wood2,
    transparent: false, side: THREE.DoubleSide });
  wall6 = new THREE.Mesh(wallGeometry3, wallMaterial3);
  wall6.receiveShadow = true;
  wall6.position.set(0, 8, -10);

  const wallGeometry4 = new THREE.BoxGeometry(15, 8, .3);
  const wallMaterial4 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: wood2, alphaMap: wood2,
    transparent: false, side: THREE.DoubleSide });
  wall7 = new THREE.Mesh(wallGeometry4, wallMaterial4);
  wall7.receiveShadow = true;
  wall7.position.set(3, 4, -17.5);
  wall7.rotation.y = .5 * Math.PI;

  const wall8 = wall7.clone();
  wall8.position.set(-3, 4, -17.5)

  wall9 = wall6.clone();
  wall9.position.set(0, 8, -25);

  const wall10 = wall4.clone();
  wall10.position.set(6, 5, -25);

  const wall11 = wall4.clone();
  wall11.position.set(-6, 5, -25);

  walls.add(wall1);
  walls.add(wall2);
  walls.add(wall3);
  walls.add(wall4);
  walls.add(wall5);
  walls.add(wall6);
  walls.add(wall7);
  walls.add(wall8);
  walls.add(wall9);
  walls.add(wall10);
  walls.add(wall11);
  scene.add(walls);

  rails = new THREE.Group();

  const railGeometry1 = new THREE.BoxGeometry(.2, 3, .2);
  const railMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  rail1 = new THREE.Mesh(railGeometry1, railMaterial1);
  rail1.receiveShadow = true;
  rail1.position.set(9.75, 1.5, -39.75);

  rail2 = rail1.clone();
  rail2.position.set(6.5, 1.5, -39.75);

  rail3 = rail1.clone();
  rail3.position.set(3.25, 1.5, -39.75);

  rail4 = rail1.clone();
  rail4.position.set(0, 1.5, -39.75);

  rail5 = rail1.clone();
  rail5.position.set(-3.25, 1.5, -39.75);

  rail6 = rail1.clone();
  rail6.position.set(-6.5, 1.5, -39.75);

  rail7 = rail1.clone();
  rail7.position.set(-9.75, 1.5, -39.75);

  rail8 = rail1.clone();
  rail8.position.set(-9.75, 1.5, -30);

  rail9 = rail1.clone();
  rail9.position.set(-9.75, 1.5, -27.25);

  rail10 = rail1.clone();
  rail10.position.set(9.75, 1.5, -30);

  rail11 = rail1.clone();
  rail11.position.set(9.75, 1.5, -27.25);

  rail15 = rail1.clone();
  rail15.position.set(9.75, 1.5, -35.5);

  rail16 = rail1.clone();
  rail16.position.set(9.75, 1.5, -32.75);

  rail17 = rail1.clone();
  rail17.position.set(9.75, 1.5, -38.25);

  rail18 = rail1.clone();
  rail18.position.set(-9.75, 1.5, -32.75);

  rail19 = rail1.clone();
  rail19.position.set(-9.75, 1.5, -35.5);

  rail20 = rail1.clone();
  rail20.position.set(-9.75, 1.5, -38.25);

  const railGeometry2 = new THREE.BoxGeometry(19.75, .2, .2);
  const railMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  rail12 = new THREE.Mesh(railGeometry2, railMaterial2);
  rail12.receiveShadow = true;
  rail12.position.set(0, 3, -39.75);

  const railGeometry3 = new THREE.BoxGeometry(.2, .2, 14.75);
  const railMaterial3 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  rail13 = new THREE.Mesh(railGeometry3, railMaterial3);
  rail13.receiveShadow = true;
  rail13.position.set(9.75, 3, -32.25);

  rail14 = rail13.clone();
  rail14.position.set(-9.75, 3, -32.25);

  rails.add(rail1);
  rails.add(rail2);
  rails.add(rail3);
  rails.add(rail4);
  rails.add(rail5);
  rails.add(rail6);
  rails.add(rail7);
  rails.add(rail8);
  rails.add(rail9);
  rails.add(rail10);
  rails.add(rail11);
  rails.add(rail12);
  rails.add(rail13);
  rails.add(rail14);
  rails.add(rail15);
  rails.add(rail16);
  rails.add(rail17);
  rails.add(rail18);
  rails.add(rail19);
  rails.add(rail20);

  scene.add(rails);

  //door and door knob
  doorGroup = new THREE.Group();
  doorGroup.position.set(-2, 3, -10)

  const doorGeometry = new THREE.BoxGeometry(4, 6, .3);
  const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: wood1, alphaMap: wood1,
    transparent: false, side: THREE.DoubleSide });
  door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.receiveShadow = true;
  door.position.set(2, 0, 0);

  const doorHandleGeometry = new THREE.CylinderGeometry(.1, .1, .2, 20);
  const doorHandleMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  doorHandle = new THREE.Mesh(doorHandleGeometry, doorHandleMaterial);
  doorHandle.receiveShadow = true;
  doorHandle.position.set(3.5, -.2, .2);
  doorHandle.rotation.x = .5 * Math.PI;

  const doorKnobGeometry = new THREE.SphereGeometry(.15, .2, .3);
  const doorKnobMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  doorKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
  doorKnob.receiveShadow = true;
  doorKnob.position.set(3.5, -.2, .3);

  doorGroup.add(door);
  doorGroup.add(doorHandle);
  doorGroup.add(doorKnob);

  scene.add(doorGroup);

  //table and table legs
  table = new THREE.Group();

  const legGeometry = new THREE.BoxGeometry(.2, 3, .2);
  const legMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  leg1 = new THREE.Mesh(legGeometry, legMaterial);
  leg1.position.set(1, 1.5, 3.8);
  leg1.castShadow = true;

  const leg2 = leg1.clone();
  leg2.position.set(-1, 1.5, 3.8);
  leg2.castShadow = true;

  const leg3 = leg1.clone();
  leg3.position.set(1, 1.5, -3.8);
  leg3.castShadow = true;

  const leg4 = leg1.clone();
  leg4.position.set(-1, 1.5, -3.8);
  leg4.castShadow = true;

  const tableTopGeometry = new THREE.BoxGeometry(2.5, .2, 8);
  const tableTopMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: brown, alphaMap: brown,
    transparent: false, side: THREE.DoubleSide });
  tabletop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
  tabletop.position.set(0, 3, 0);
  tabletop.castShadow = true;

  table.add(leg1);
  table.add(leg2);
  table.add(leg3);
  table.add(leg4);
  table.add(tabletop);

  table.position.set(8.5, 0, 0)
  scene.add(table);

  //cubes lebitating above table
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: fire, alphaMap: fire,
    transparent: false, side: THREE.DoubleSide });
  cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial1);
  cube1.position.set(8.5, 4.5, 0);

  const cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: crate1, alphaMap: crate1,
    transparent: false, side: THREE.DoubleSide });
  cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2);
  cube2.position.set(8.5, 4.5, 2);

  const cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0xffffff, map: crate2, alphaMap: crate2,
    transparent: false, side: THREE.DoubleSide });
  cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial3);
  cube3.position.set(8.5, 4.5, -2);

  scene.add(cube1);
  scene.add(cube2);
  scene.add(cube3);

  //pedestals cubes hover over
  const pedestalGeometry = new THREE.CylinderGeometry(.5, .8, .3, 20);
  const pedestalMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: metal, alphaMap: metal,
    transparent: false, side: THREE.DoubleSide });
  pedestal1 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal1.position.set(8.5, 3.2, 0);

  pedestal2 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal2.position.set(8.5, 3.2, 2);

  pedestal3 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal3.position.set(8.5, 3.2, -2);

  scene.add(pedestal1);
  scene.add(pedestal2);
  scene.add(pedestal3);

  //create the player model
  player = new THREE.Group();
  scene.add(player);
}

function animate() {
  //rendering and animation
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  const dt = clock.getDelta();

  //cubes 1, 2, and 3 rotating in different ways
  cube1.rotation.x += 0.02;
  cube1.rotation.y += 0.02;
  cube2.rotation.y += 0.02;
  cube2.rotation.z += 0.02;
  cube3.rotation.x += 0.02;
  cube3.rotation.z += 0.02;

  //finds where mouse is located
  raycaster.setFromCamera(mouse, camera);

  //bird animations
  birdGroup1.rotation.y += .005
  if(birdMixer)birdMixer.update( dt );
  if(birdMixer2)birdMixer2.update( dt );
  if(birdMixer3)birdMixer3.update( dt );

  //animation of player moving
  if (player.userData!==undefined && player.userData.move!==undefined){
    characterMixer.update( dt );
    player.translateZ(player.userData.move.forward * dt * 5);
    player.rotateY(player.userData.move.turn * dt);
  }

  //sets a position for camera to look and looks at it
   camera.position.lerp(cameras[cameraIndex].getWorldPosition(new THREE.Vector3()), 0.05);
   const pos = player.position.clone();
   pos.y += 3;
   camera.lookAt(pos);
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
