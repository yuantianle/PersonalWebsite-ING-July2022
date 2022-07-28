var scene, camera, renderer;
var axes, plane, meshes, material
var normalMapTexture, textureLoader;
var controls, stats, gui;
var nowtime;
var renderflag = false;

/* Buttons to handle scene switch */
$("#ifrender").click(function() {
     renderflag = !renderflag;
   })

const options = {
     showAxis: false,
     enableSwoopingCamera: false,
     enableRotation: true,
     transmission: 1,
     thickness: 1.2,
     roughness: 0.35,
     envMapIntensity: 2.5,
     clearcoat: 1,
     clearcoatRoughness: 0.1,
     normalScale: 8,
     clearcoatNormalScale: 3.14,
     normalRepeat: 1,
     bloomThreshold: 0.85,
     bloomStrength: 0.5,
     bloomRadius: 0.33,
};

const positions = [
     [-0.85, 0.85, 0],
     [0.85, 0.85, 0],
];
 
const geometries = [
     new THREE.IcosahedronGeometry(0.75, 0), // Faceted
     new THREE.IcosahedronGeometry(0.67, 24), // Sphere
];

/*-------------------------------
     Initiation
--------------------------------*/
function init()
{
     initScene(); 
     initCamera();
     initRenender();
     
     initLight();
     setWindown();
     initTextureLoader();
     setGeometrys();

     initOthers();

     setControl();
     setGUI();
     setEventsMouse();
     setKeyEvents(); 
     refreshWindown();    
    
     setStatusMontor();

     loop();
}

/*-------------------------------
     Scene
--------------------------------*/
function initScene()
{
     scene = new THREE.Scene();
}

/*-------------------------------
     Camera
--------------------------------*/
function  initCamera()
{
     camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
     camera.position.x = -2;
     camera.position.y = 3;
     camera.position.z = 3;
     camera.lookAt(scene.position);
}

/*-------------------------------
     Create Renderer Object
--------------------------------*/
function initRenender()
{
     renderer = new THREE.WebGLRenderer();
     renderer.setSize( window.innerWidth, window.innerHeight );  //set the range of render region
     //renderer's shadow effects
     renderer.setClearColor(new THREE.Color(0x000000));
     renderer.shadowMap.enabled = true;
}


/*-------------------------------
     Adaptive window size monitor
--------------------------------*/
function refreshWindown(){
     //add event monitor, adapt the window
     window.addEventListener('resize', function(){
         var width = window.innerWidth*0.82;
         var height = window.innerHeight*0.8;
         renderer.setSize(width,height);
         camera.aspect = width/height;
         camera.updateProjectionMatrix();
         renderer.render( scene, camera );
     });
}

function setWindown(){
     var width = window.innerWidth*0.82;
     var height = window.innerHeight*0.77;
     renderer.setSize(width,height);
     camera.aspect = width/height;
     camera.updateProjectionMatrix();
     renderer.render( scene, camera );
}

/*-------------------------------
     Light source
--------------------------------*/
function initLight()
{
     var spotLight = new THREE.SpotLight( 0xffffff );
     spotLight.position.set( 0, 60, 10 );
     //spotlight resolution
     spotLight.angle = Math.PI/20;
     spotLight.shadow.penumbra = 0.05;
     spotLight.shadow.mapSize.width = 2048;
     spotLight.shadow.mapSize.height = 2048;
     scene.add( spotLight );
     // Set projection
     spotLight.castShadow = true;

     var spotLight2 = new THREE.SpotLight( 0xffffff );
     spotLight2.position.set( -10, 30, 0 );
     //spotlight resolution
     spotLight2.angle = Math.PI/20;
     spotLight2.shadow.penumbra = 0.05;
     spotLight2.shadow.mapSize.width = 2048;
     spotLight2.shadow.mapSize.height = 2048;
     scene.add( spotLight2 );
     // Set projection
     spotLight2.castShadow = true;
}

function initTextureLoader()
{
     textureLoader = new THREE.TextureLoader();
}


/*-------------------------------
     Geometry
--------------------------------*/
function setGeometrys()
{
     //---1.Axis-----------------------
     axes = new THREE.AxesHelper(5);

     //---2.Relative ground-------------
     var planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
     const planeTexture = textureLoader.load("assets/js/Three_js/texture/Mark.jpg");
     const planeMaterial = new THREE.MeshPhongMaterial({ map: planeTexture, color: 0xffffff, shininess:40});
     plane = new THREE.Mesh(planeGeometry, planeMaterial);
     
     plane.rotation.x = -0.5 * Math.PI;
     plane.rotation.z = 0.25 * Math.PI;
     plane.position.set(0, -2, -2);
     scene.add(plane);
     // Set projection
     plane.receiveShadow = true;

     //---3.Object-----------------------
     normalMapTexture = textureLoader.load("assets/js/Three_js/texture/noise_normal.jpg");
     normalMapTexture.wrapS = THREE.RepeatWrapping;
     normalMapTexture.wrapT = THREE.RepeatWrapping;
     normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat);
     
     const hdrEquirect = new THREE.RGBELoader().load(
          "assets/js/Three_js/texture/royal_esplanade_4k.hdr",
          () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = hdrEquirect;
            scene.enviroment = hdrEquirect;
          }
        );
     
     material = new THREE.MeshPhysicalMaterial({
          transmission: options.transmission,
          thickness: options.thickness,
          roughness: options.roughness,
          envMap: hdrEquirect,
          envMapIntensity: options.envMapIntensity,
          clearcoat: options.clearcoat,
          clearcoatRoughness: options.clearcoatRoughness,
          normalScale: new THREE.Vector2(options.normalScale),
          normalMap: normalMapTexture,
          clearcoatNormalMap: normalMapTexture,
          clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale),
     });

     meshes = geometries.map(
          (geometry) => new THREE.Mesh(geometry, material)
     );
     meshes.forEach((mesh, i) => {
          scene.add(mesh);
          mesh.position.set(...positions[i]);
          // Set projection
          mesh.castShadow = true;
     });

}

function initOthers()
{
     document.getElementById('webgl-output').appendChild(renderer.domElement); //append three.js canvas object into body element
     renderer.render(scene, camera);
}

/*-------------------------------
     Control
--------------------------------*/
function setControl()
{
     //orbit for camera movement
     controls = new THREE.OrbitControls(camera,renderer.domElement);
     controls.enableDamping = true;
     controls.enabled = !options.enableSwoopingCamera;
     controls.addEventListener('change', () => {
          if(renderflag)renderer.render(scene, camera)
     })
     //object 3Ding
     //effect = new THREE.AnaglyphEffect(renderer);
     //effect.setSize(window.innerWidth, window.innerHeight);
}
//add GUI
function setGUI()
{
     gui = new dat.GUI({ autoPlace: false });
     gui.close();
     //erase function:
     //cube.rotation.set(0, 0, 0);

     gui.add(options, "showAxis").onChange((val) => {
          options.axis = val;
     });

     gui.add(options, "enableSwoopingCamera").onChange((val) => {
          controls.enabled = !val;
          controls.reset();
     });
      
     gui.add(options, "enableRotation").onChange(() => {
     });
      
     gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
          material.transmission = val;
     });
      
     gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
          material.thickness = val;
     });
      
     gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
          material.roughness = val;
     });
      
     gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
          material.envMapIntensity = val;
     });
      
     gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
          material.clearcoat = val;
     });
      
     gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
          material.clearcoatRoughness = val;
     });
      
     gui.add(options, "normalScale", 0, 10, 0.01).onChange((val) => {
          material.normalScale.set(val, val);
     });
      
     gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
          material.clearcoatNormalScale.set(val, val);
     });
      
     gui.add(options, "normalRepeat", 1, 4, 1).onChange((val) => {
          normalMapTexture.repeat.set(val, val);
     });
      
     const postprocessing = gui.addFolder("Post Processing");
     postprocessing.open();
     document.getElementById('webgl-output').appendChild(gui.domElement);
     gui.domElement.id = 'guiContainer';
}
//Define mouse event
function setEventsMouse(){
    //left
    window.addEventListener( 'click', function(e){
        if(e.button===0){
            //console.log("clicked left botton");
        }
    } );
    //right
    window.addEventListener( 'contextmenu', function(e){
        if(e.button===2){
            //console.log("clicked right botton");
        }
    } );
    //move
    window.addEventListener( 'mousemove', function(e){
       //console.log('x:'+e.x);
       //console.log('y:'+e.y);
    } );
}
//Define keyboard event
function setKeyEvents(){
    window.addEventListener('keydown',function(e){
        //console.log(e);
    }); 
}

/*-------------------------------
     Status monitor
--------------------------------*/
function setStatusMontor()
{
     stats = new Stats();
     stats.setMode( 0 );
     stats.domElement.style.position = 'absolute';
     stats.domElement.style.left = '0px';
     stats.domElement.style.top = '0px';
     document.getElementById('statsContainer').appendChild(stats.domElement);
}

/*-------------------------------
     Logic & Animate
--------------------------------*/
//Logic
var update=function(deltaTime)
{
     const ROTATE_TIME = 5000; // Time in seconds for a full rotation
     const xAxis = new THREE.Vector3(1, 0, 0);
     const yAxis = new THREE.Vector3(0, 1, 0);
     const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
     const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

     if(options.enableSwoopingCamera)
     {
          camera.position.x = Math.sin((nowtime / ROTATE_TIME) * Math.PI * 2) * 2;
          camera.position.y = Math.cos((nowtime / ROTATE_TIME) * Math.PI * 2) * 2;
          camera.position.z = 5;
          camera.lookAt(scene.position);
     }
     if(options.enableRotation)
    	{
          meshes.forEach((mesh) => {
               mesh.rotateOnWorldAxis(xAxis, rotateX);
               mesh.rotateOnWorldAxis(yAxis, rotateY);
          });
     }
     if (options.axis == true)
          scene.add(axes);
     else
          scene.remove(axes);
     //controls.update();
}

//Animate (Render)
var animate=function() {
      //render 3D scene
     if(renderflag)
          renderer.render( scene, camera );     
     //render 3D effect
     //effect.render(scene,camera); 
}

//Loop update and render
nowtime = new Date(); // the last time T0
var loop=function() {     
     //animated object
     let T1 = new Date(); // the time at this moment
     let t = T1 - nowtime;
     nowtime = T1;
     requestAnimationFrame(loop);
     controls.update();
     update(t);
     animate();
     stats.update();
}

window.onload = init
