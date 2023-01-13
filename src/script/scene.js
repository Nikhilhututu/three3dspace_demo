
import * as THREE from 'three';
let controls,renderer,scene,cube;
const frustumSize   = 8;
const mGameaspect  = window.innerWidth/window.innerHeight;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
const initMouse = new THREE.Vector2(1, 1);
let cubePosition = new THREE.Vector3(1, 1);
let cubeRotation = new THREE.Vector3(1, 1);
let cubeScale = new THREE.Vector3(1, 1);
let cameraPosition = new THREE.Vector3(1, 1);
let cameraScreen = 0;
window["onClickIcon"] = onClickIcon;
const views = [
    {
      left: 0.0,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xFEFCF3),
      eye: [ 0, 5,10],
      actions: -1,
    },
    {
      left: 0.0,
      bottom: 0.0,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xF5EBE0),
      eye: [ 10, 0,0],
      actions: -1,
    },
    {
      left: 0.5,
      bottom: 0.0,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xF0DBDB),
      eye: [ 0, 10,0],
      actions: -1,
    },
    {
      left: 0.5,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xDBA39A),
      eye: [ 0, 0,10],
      actions: -1,

    },
  ];
export const initScene = ()=>{
    scene = new THREE.Scene();
    for ( let c = 0; c < views.length; ++ c ) {
        const view = views[ c ];
        let camera;
        if(c===0){
            camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
            const helper = new THREE.CameraHelper(camera);
            scene.add(helper);
        }
        else
            camera =  new THREE.OrthographicCamera( -frustumSize * mGameaspect ,frustumSize*mGameaspect , frustumSize , -frustumSize,0,10000);
        camera.position.fromArray( view.eye );
        // camera.up.fromArray( view.up );
        camera.lookAt(0, 0, 0);
        view.camera = camera;
    }
    // scene.background = new THREE.Color( 0xBCD48F );
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true,preserveDrawingBuffer: true});
    renderer.setSize(window.innerWidth, window.innerHeight );
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor( 0x000000,1);
    document.body.appendChild(renderer.domElement);
    const light = new THREE.HemisphereLight( 0xffffff,0xffffff,1);
    light.position.set(0,100,0);
    scene.add(light.clone());
    // controls = new OrbitControls(views[0].camera,renderer.domElement);
    // controls.autoRotate = false;
    // controls.enabled    = false;
    const cubesgeometry = new THREE.BoxGeometry(2,2,2);
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper( size, divisions );
    // gridHelper.rotation.x = Math.PI/4;
    scene.add( gridHelper );
    const material = new THREE.MeshBasicMaterial({color:"#ffffff"});
    material.opacity = .5;
    cube = new THREE.Mesh(cubesgeometry,material);
    // cube.position.y+=1;
    scene.add(cube);
    window.addEventListener('resize', onWindowResize,false  );
    renderScene();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
} 
let counter=0;
function renderScene (){
    requestAnimationFrame(renderScene);
    // renderer.render(scene,camera);
    // cubes.rotation.y = counter*.01
    // counter++;
    // if(transcontrols!== null)
    //     transcontrols.update();
    for ( let c = 0; c < views.length; ++ c ) {
        const view = views[ c ];
        const camera = view.camera;
        // view.updateCamera( camera, scene, mouseX, mouseY );
        const left = Math.floor( window.innerWidth * view.left );
        const bottom = Math.floor( window.innerHeight * view.bottom );
        const width = Math.floor( window.innerWidth * view.width );
        const height = Math.floor( window.innerHeight * view.height );

        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );
        renderer.setScissorTest( true );
        renderer.setClearColor( view.background );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render( scene, camera );
    }
    // controls.update();
}
const onWindowResize=()=> {

    const aspectRatio = window.innerWidth / window.innerHeight;
    for (let c = 0; c < views.length; ++c) {
      const camera = views[c].camera;
      if (c == 0) {
            camera.aspect = aspectRatio;
            camera.updateProjectionMatrix();
      } else {
            camera.left = (-frustumSize * aspectRatio) / 2;
            camera.right = (frustumSize * aspectRatio) / 2;
            camera.top = frustumSize / 2;
            camera.bottom = -frustumSize / 2;
            camera.updateProjectionMatrix();
      }
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function onClickIcon(evt,type, cameraType) {
    let i, allButtons;
    allButtons = document.getElementsByClassName("myButton");
    for (i = 0; i < allButtons.length; i++) {
        allButtons[i].className = allButtons[i].className.replace(" active", "");
    }
    console.log(allButtons.length,"       ",evt);
    evt.currentTarget.className += " active";
    switch(cameraType){
        case 0:
            views[2].actions = type;
            break;
        case 1:
            views[1].actions = type;
            break;
        case 2:
            views[3].actions = type;
            break;
      }
  }

function onMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    initMouse.set(mouse.x, mouse.y);
    cubePosition.copy(cube.position);
    cubeRotation.copy(cube.rotation);
    cubeScale.copy(cube.scale);
    cameraPosition.copy(views[0].camera.position);
    if (mouse.x < 0 && mouse.y < 0)
         cameraScreen = 1;
    if (mouse.x > 0 && mouse.y > 0) 
        cameraScreen = 2;
    if (mouse.x > 0 && mouse.y < 0) 
        cameraScreen = 3;

      console.log(cameraScreen);  
  }
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (cameraScreen<1) 
        return;
        // console.log(views[cameraScreen].actions,"       ",cameraScreen)
    if (views[cameraScreen].actions == "move") {
        switch(cameraScreen){
                case 1:
                    cube.position.z = cubePosition.z - (mouse.x - initMouse.x) * 10;
                    cube.position.y = cubePosition.y + (mouse.y - initMouse.y) * 10;
                    break;    
                case 2:
                    cube.position.x = cubePosition.x + (mouse.x - initMouse.x) * 10;
                    cube.position.y = cubePosition.y + (mouse.y - initMouse.y) * 10;
                    break;    
                case 3:
                    cube.position.x = cubePosition.x + (mouse.x - initMouse.x) * 10;
                    cube.position.z = cubePosition.z - (mouse.y - initMouse.y) * 10;
                    break;    
        }
    }
    if (views[cameraScreen].actions == "scale") {
        switch(cameraScreen){
            case 1:
                cube.scale.z = cubeScale.z + (mouse.x - initMouse.x) * 10;
                cube.scale.y = cubeScale.y + (mouse.y - initMouse.y) * 10;
                break;
            case 2:
                cube.scale.x = cubeScale.x + (mouse.x - initMouse.x) * 10;
                cube.scale.y = cubeScale.y + (mouse.y - initMouse.y) * 10;
                break;
            case 3:
                cube.scale.x = cubeScale.x + (mouse.x - initMouse.x) * 10;
                cube.scale.z = cubeScale.z + (mouse.y - initMouse.y) * 10;
                break;
        }
    }
    if (views[cameraScreen].actions == "rotate") {
        switch(cameraScreen){
            case 1:
                cube.rotation.y = cubeRotation.y - (mouse.x - initMouse.x) * 10;
                cube.rotation.z = cubeRotation.z + (mouse.y - initMouse.y) * 10;
                break;
            case 2:
                cube.rotation.y = cubeRotation.y + (mouse.x - initMouse.x) * 10;
                cube.rotation.x = cubeRotation.x + (mouse.y - initMouse.y) * 10;
                break;
            case 3:
                cube.rotation.x = cubeRotation.x + (mouse.x - initMouse.x) * 10;
                cube.rotation.z = cubeRotation.z - (mouse.y - initMouse.y) * 10;
                break;
        }
    }
    if (views[cameraScreen].actions == "camera" && cameraScreen > 0) {
      const camera = views[0].camera;
      switch(cameraScreen){
            case 1:
                camera.position.z = cameraPosition.z - (mouse.x - initMouse.x) * 10;
                camera.position.y = cameraPosition.y + (mouse.y - initMouse.y) * 10;
                break;
            case 2:
                camera.position.x = cameraPosition.x + (mouse.x - initMouse.x) * 10;
                camera.position.y = cameraPosition.y + (mouse.y - initMouse.y) * 10;
                break;
            case 3:
                camera.position.x = cameraPosition.x + (mouse.x - initMouse.x) * 10;
                camera.position.z = cameraPosition.z - (mouse.y - initMouse.y) * 10;
                break;
      }
    }
  }
  function onMouseUp(event) {
     event.preventDefault();
     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
     cameraScreen = -1;
  }