/*import * as THREE from 'three';
import {AnaglyphEffect} from 'assets/js/Three_js/effects/AnaglyphEffect.js';
AnaglyphEffect = require('assets/js/Three_js/effects/AnaglyphEffect.js');
import {OrbitControls} from 'assets/js/Three_js/controls/OrbitControls.js';
OrbitControls = require('assets/js/Three_js/controls/OrbitControls.js');
import Stats from 'assets/jsm/libs/stats.module.js';*/

var scene,camera,renderer,controls,stats, axes, plane, cube;

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
     setGeometrys();

     initOthers();

     setControl();
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
     camera.position.x = -5;
     camera.position.y = 5;
     camera.position.z = 5
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
         var height = window.innerHeight*0.7;
         renderer.setSize(width,height);
         camera.aspect = width/height;
         camera.updateProjectionMatrix();
         renderer.render( scene, camera );
     });
}

function setWindown(){
     var width = window.innerWidth*0.82;
     var height = window.innerHeight*0.7;
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
     spotLight.position.set( -40, 60, -10 );
     scene.add( spotLight );
     // Set projection
     spotLight.castShadow = true;
}

/*-------------------------------
     Geometry
--------------------------------*/
function setGeometrys()
{
     //---1.Axis-----------------------
     axes = new THREE.AxesHelper(20);
     scene.add(axes);

     //---2.Relative ground-------------
     var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
     var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
     plane = new THREE.Mesh(planeGeometry, planeMaterial);
     plane.rotation.x = -0.5 * Math.PI;
     plane.position.x = 15
     plane.position.y = 0
     plane.position.z = 0
     scene.add(plane);
     // Set projection
     plane.receiveShadow = true;

     //---3.Object-----------------------
     var geometry = new THREE.BoxGeometry( 1, 1, 1 );
     var material = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular:0x4488ee, shininess:12} );
     cube = new THREE.Mesh( geometry, material );
     cube.position.x = 0;
     cube.position.y = 2;
     cube.position.z = 0;
     scene.add( cube );
     // Set projection
     cube.castShadow  = true;
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
     controls.addEventListener('change', () => {
          renderer.render(scene, camera)
     })
     //object 3Ding
     //effect = new THREE.AnaglyphEffect(renderer);
     //effect.setSize(window.innerWidth, window.innerHeight);
}

//add GUI
function setGUI()
{
     const gui = new GUI()
     const cubeFolder = gui.addFolder('Cube')
     cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
     cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
     cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
     cubeFolder.open()
     const cameraFolder = gui.addFolder('Camera')
     cameraFolder.add(camera.position, 'z', 0, 10)
     cameraFolder.open()
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
     stats.showPanel( 0 );
     document.body.appendChild( stats.domElement);
}

/*-------------------------------
     Logic & Animate
--------------------------------*/
//Logic
var update=function()
{
    	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
     //controls.update();
}

//Animate (Render)
var animate=function() {
      //render 3D scene
     renderer.render( scene, camera );     

     //render 3D effect
     //effect.render(scene,camera); 
}

//Loop update and render
let T0 = new Date(); // the last time T0
var loop=function() {     
     //animated object
     let T1 = new Date(); // the time at this moment
     let t = T1 - T0;
     T0 = T1;
     requestAnimationFrame(loop);
     update();
     animate();
     stats.update();
}

window.onload = init
