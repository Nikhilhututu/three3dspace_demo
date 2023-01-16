import * as THREE from 'three';
let   renderer,scene,cube;
let frustumSize  = 8;
const mGameaspect  = window.innerWidth/window.innerHeight;
const mousePosition      = new THREE.Vector2(1, 1);
const initMousePosition  = new THREE.Vector2(1, 1);
const multiplier =18;
let cubePosition      = new THREE.Vector3(1, 1);
let cubeRotation      = new THREE.Vector3(1, 1);
let cubeScale         = new THREE.Vector3(1, 1);
let cameraPosition    = new THREE.Vector3(1, 1);
let cameraScreen   = 0;
window["onClickIcon"] = onClickIcon;
const CAMERA_Y_Z = 1,CAMERA_X_Y = 2,CAMERA_Z_X = 3;
const views = [
    {
      left: 0.0,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xFEFCF3),
      eye: [ 0, 10,10],
      actions: -1,
      fov:60
    },
    {
      left: 0.0,
      bottom: 0.0,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color(0xF5EBE0),
      eye: [ -10, 0,0],
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
        camera.lookAt(0, 0, 0);
        view.camera = camera;
    }
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true,preserveDrawingBuffer: true});
    renderer.setSize(window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
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
    const material = new THREE.MeshStandardMaterial({vertexColors: true,color:"#ffffff"});
    material.metalness=0;
    material.roughness=1;
    const positionAttribute = cubesgeometry.getAttribute('position');
    const colors = [];
    const color = new THREE.Color();
    for ( let i = 0; i < positionAttribute.count; i += 3 ) {
            color.set( Math.random() * 0x00ffff );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
    }
    cubesgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper( size, divisions );
    // gridHelper.rotation.x = Math.PI/4;
    scene.add( gridHelper );
    material.opacity = .5;
    cube = new THREE.Mesh(cubesgeometry,material);
    cube.geometry.elementsNeedUpdate = true;
    // cube.position.y+=1;
    scene.add(cube);
    window.addEventListener('resize', onWindowResize,false  );
    renderScene();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    
} 
function onClickIcon(evt,type, cameraNo) {
    let i, allButtons;
    allButtons = document.getElementsByClassName("myButton");
    const num = evt.currentTarget.id.replace(/[^0-9]/g,'');
    for (i = 0; i < allButtons.length; i++) {
        const id = allButtons[i].id.replace(/[^0-9]/g,'');
        if(num === id){
            allButtons[i].className = allButtons[i].className.replace(" active", "");
        }
    }
    evt.currentTarget.className += " active";
    switch(cameraNo){
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
        // switch(c){
        //     case CAMERA_X_Y:
        //          camera.position.x =  cubePosition.x;
        //          camera.position.y =  cubePosition.x;
        //         break;
        // }
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
            camera.left = (-frustumSize * aspectRatio);
            camera.right = (frustumSize * aspectRatio);
            camera.top = frustumSize;
            camera.bottom = -frustumSize;
            camera.updateProjectionMatrix();
      }
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const onMouseDown = (event)=> {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    initMousePosition.set(mousePosition.x, mousePosition.y);
    cubePosition.copy(cube.position);
    cubeRotation.copy(cube.rotation);
    cubeScale.copy(cube.scale);
    cameraPosition.copy(views[0].camera.position);

    if (mousePosition.x < 0 && mousePosition.y < 0)
        cameraScreen = CAMERA_Y_Z;
    if (mousePosition.x > 0 && mousePosition.y > 0) 
        cameraScreen = CAMERA_X_Y;
    if (mousePosition.x > 0 && mousePosition.y < 0) 
        cameraScreen = CAMERA_Z_X;
  }
const onMouseMove = (event)=> {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (cameraScreen<1) 
        return;
        // console.log(views[cameraScreen].actions,"       ",cameraScreen)

        // distance =  mousePosition.distanceTo(initMousePosition)
        // console.log(distance);
        
    if (views[cameraScreen].actions == "move") {
        console.log(cameraScreen)
        switch(cameraScreen){
                case CAMERA_Y_Z:
                    cube.position.z = cubePosition.z + (mousePosition.x - initMousePosition.x) *multiplier;
                    cube.position.y = cubePosition.y + (mousePosition.y - initMousePosition.y) *multiplier;
                    break;    
                case CAMERA_X_Y:
                    cube.position.x = cubePosition.x + (mousePosition.x - initMousePosition.x) *multiplier;
                    cube.position.y = cubePosition.y + (mousePosition.y - initMousePosition.y) *multiplier;
                    break;    
                case CAMERA_Z_X:
                    cube.position.x = cubePosition.x + (mousePosition.x - initMousePosition.x) *multiplier;
                    cube.position.z = cubePosition.z - (mousePosition.y - initMousePosition.y) *multiplier;
                    break;    
        }
    }
    if (views[cameraScreen].actions == "scale") {
        switch(cameraScreen){
            case CAMERA_Y_Z:
                cube.scale.z = cubeScale.z + (mousePosition.x - initMousePosition.x) *multiplier;
                cube.scale.y = cubeScale.y + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_X_Y:
                cube.scale.x = cubeScale.x + (mousePosition.x - initMousePosition.x) *multiplier;
                cube.scale.y = cubeScale.y + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_Z_X:
                cube.scale.x = cubeScale.x + (mousePosition.x - initMousePosition.x) *multiplier;
                cube.scale.z = cubeScale.z + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
        }
    }
    if (views[cameraScreen].actions == "rotate") {
        switch(cameraScreen){
            case CAMERA_Y_Z:
                cube.rotation.y = cubeRotation.y - (mousePosition.x - initMousePosition.x) *multiplier;
                cube.rotation.z = cubeRotation.z + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_X_Y:
                cube.rotation.y = cubeRotation.y + (mousePosition.x - initMousePosition.x) *multiplier;
                cube.rotation.x = cubeRotation.x + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_Z_X:
                cube.rotation.x = cubeRotation.x + (mousePosition.x - initMousePosition.x) *multiplier;
                cube.rotation.z = cubeRotation.z - (mousePosition.y - initMousePosition.y) *multiplier;
                break;
        }
    }
    if (views[cameraScreen].actions == "camera" && cameraScreen > 0) {
      const camera = views[0].camera;
      switch(cameraScreen){
            case CAMERA_Y_Z:
                camera.position.z = cameraPosition.z - (mousePosition.x - initMousePosition.x) *multiplier;
                camera.position.y = cameraPosition.y + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_X_Y:
                camera.position.x = cameraPosition.x + (mousePosition.x - initMousePosition.x) *multiplier;
                camera.position.y = cameraPosition.y + (mousePosition.y - initMousePosition.y) *multiplier;
                break;
            case CAMERA_Z_X:
                camera.position.x = cameraPosition.x + (mousePosition.x - initMousePosition.x) *multiplier;
                camera.position.z = cameraPosition.z - (mousePosition.y - initMousePosition.y) *multiplier;
                break;
      }
    }
  }
  const onMouseUp = (event)=> {
     event.preventDefault();
     mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
     mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
     cameraScreen = -1;
  }
//   const zoom = {valueUp:0,valueDown:0,acc:.01}
//   const onMouseWheel = (event)=> {
//      if(event.deltaY>0){
//         zoom.valueUp+=zoom.acc;
//         views[0].camera.position.z +=zoom.valueUp;
//         console.log("iffffffffffff");
//      }
//      else{
//         zoom.valueDown-=zoom.acc;
//         views[0].camera.position.z +=zoom.valueDown;
//         console.log("elseeeeeee");
//      }
//  }