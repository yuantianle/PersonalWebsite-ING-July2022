 
/*-------------------------------
     Scene
--------------------------------*/
var scene = new THREE.Scene();
 
/*-------------------------------
     Camera
--------------------------------*/
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = -5;
camera.position.y = 5;
camera.position.z = 5
camera.lookAt(scene.position);

/*-------------------------------
     Create Renderer Object
--------------------------------*/
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );  //set the range of render region
document.body.appendChild( renderer.domElement ); //append canvas object into body element

//renderer's shadow effects
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

/*-------------------------------
     Axis
--------------------------------*/
var axes = new THREE.AxesHelper(20);
scene.add(axes);

/*-------------------------------
     Relative ground
--------------------------------*/
var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15
plane.position.y = 0
plane.position.z = 0
scene.add(plane);
 
// Set projection
plane.receiveShadow = true;


/*-------------------------------
     Object
--------------------------------*/
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular:0x4488ee, shininess:12} );
var cube = new THREE.Mesh( geometry, material );
cube.position.x = 0;
cube.position.y = 2;
cube.position.z = 0;
scene.add( cube );

// Set projection
cube.castShadow  = true;


/*-------------------------------
     Light source
--------------------------------*/
var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -40, 60, -10 );
scene.add( spotLight );

// Set projection
spotLight.castShadow = true;


/*-------------------------------
     (Render) Animate
--------------------------------*/
let T0 = new Date(); // the last time T0
function animate() {
    let T1 = new Date(); // the time at this moment
    let t = T1 - T0;
    T0 = T1;
	requestAnimationFrame( animate );
    renderer.render( scene, camera );

    //animated object
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
};

animate();

/*-------------------------------
     Control
--------------------------------*/
var controls = new THREE.OrbitControls(camera,renderer.domElement); //create control object
controls.addEventListener('change', render); //monitoring mouse and keyboard event


/*-------------------------------
     Status monitor
--------------------------------*/
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );


/*-------------------------------
     Adaptive window size monitor
--------------------------------*/
window.onresize=function(){
    // Reset the renderer, output canvas size
    renderer.setSize(window.innerWidth,window.innerHeight);
    // In full screen mode: Set the aspect ratio of the viewing range to the aspect ratio of the window
    camera.aspect = window.innerWidth/window.innerHeight;
    // The renderer executes the render method and reads the camera object's projectionMatrix property
    // However, the projection matrix will not be calculated by the attributes of the camera every frame rendering (saving computing resources). 
    // If some attributes of the camera change, the "updateProjectionMatrix ()" method needs to be executed to update the projection matrix of the camera
    camera.updateProjectionMatrix ();
    renderer.render( scene, camera );
};
   