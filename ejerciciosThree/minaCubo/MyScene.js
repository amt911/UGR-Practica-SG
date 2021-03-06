
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import { GUI } from '../libs/dat.gui.module.js'
import { OrbitControls } from '../libs/OrbitControls.js'
import { Stats } from '../libs/stats.module.js'
import {VoxelWorld} from './todo.js'

// Clases de mi proyecto

import { Esteban } from './Esteban.js'
import { Zombie } from './Zombie.js'
import { Cerdo } from './Cerdo.js'

import * as cubos from './Cubo.js'
import * as estructuras from './estructuras.js'

import * as PM from './ParametrosMundo.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  getCanvas(){
    return $(this.myCanvasName);
  }

  constructor(myCanvas) {
    super();

    this.movt = "parado";
    this.mapTeclas = {
      "W": false,
      "A": false,
      "D": false,
      "S": false,
      " ": false
    };

    this.myCanvasName=myCanvas;
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    this.initStats();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights();

    // Tendremos una cámara con un control de movimiento con el ratón

    // Un suelo
    //this.createGround ();

    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper(5);
    this.add(this.axis);


    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    this.model = new Esteban(this.gui, "Controles de la Caja");
    this.createCamera();

    this.ghost = new Esteban(this.gui, " de la Caja");

    var path = "texturas/cielo/";
    var format = '.png';

    var urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    //  path + 'py' + format, path + 'ny' + format,
    //  path + 'pz' + format, path + 'nz' + format
    ]

    var textureCube = new THREE.CubeTextureLoader().load(urls);

    this.background = textureCube;
    //this.add(this.ghost)
    this.add(this.model);

    this.zombie = new Zombie(this.gui, "Zombie");
    this.zombie.position.set(-3,0,0);
    this.add(this.zombie);

    /*
    let h = new cubos.Hierba();
    let mesh = new THREE.InstancedMesh(h.geometria, h.material, 32 * 32);
    
    var matrix = new THREE.Matrix4();
    var k = 0;
    for (var i = -15; i <= 16; i++) {
      for (var j = -15; j <= 16; j++) {
        matrix.setPosition(j * 16 / PM.PIXELES_ESTANDAR, -8 / PM.PIXELES_ESTANDAR, i * 16 / PM.PIXELES_ESTANDAR);
        mesh.setMatrixAt(k, matrix);
        
        k++;
      }
    }
    this.add(mesh);

    var t = new cubos.Tierra();

    //let meshtierra = new THREE.InstancedMesh(t.geometria, t.material, 32 * 32 * 2);
    this.meshtierra = new THREE.InstancedMesh(t.geometria, t.material, 32 * 32 * 2);
    var f = 0;
    for (var k = 1; k < 3; k++) {
      for (var i = -15; i <= 16; i++) {
        for (var j = -15; j <= 16; j++) {
          matrix.setPosition(j * 16 / PM.PIXELES_ESTANDAR, -8 / PM.PIXELES_ESTANDAR - k * 16 / PM.PIXELES_ESTANDAR, i * 16 / PM.PIXELES_ESTANDAR);
          this.meshtierra.setMatrixAt(f, matrix);
          f++;
        }
      }
    }
    this.add(this.meshtierra);

    var p = new cubos.Piedra();

    let meshpiedra = new THREE.InstancedMesh(p.geometria, p.material, 32 * 32 * 17);
    f = 0;
    for (var k = 3; k < 20; k++) {
      for (var i = -15; i <= 16; i++) {
        for (var j = -15; j <= 16; j++) {
          matrix.setPosition(j * 16 / PM.PIXELES_ESTANDAR, -8 / PM.PIXELES_ESTANDAR - k * 16 / PM.PIXELES_ESTANDAR, i * 16 / PM.PIXELES_ESTANDAR);
          meshpiedra.setMatrixAt(f, matrix);
          f++;
        }
      }

    }
    this.add(meshpiedra);

    var b = new cubos.PiedraBase();
    let meshbedrock = new THREE.InstancedMesh(b.geometria, b.material, 32*32);
    f=0;
    for (var i = -15; i <= 16; i++) {
      for (var j = -15; j <= 16; j++) {
        matrix.setPosition(j * 16 / PM.PIXELES_ESTANDAR, -8 / PM.PIXELES_ESTANDAR - 20 * 16 /PM.PIXELES_ESTANDAR, i * 16 / PM.PIXELES_ESTANDAR);
        meshbedrock.setMatrixAt(f, matrix);
        f++;
      }
          this.add(meshbedrock);

    }*/

/*
    let h = new cubos.Hierba();
    //let mesh = new THREE.Mesh(h.geometria, h.material);
    let arMesh=[]

    for(let k = 0; k > -30; k--){
      for(let f = 8; f > -7; f--){
        for(let c = 8; c > -7; c--){
          //let mesh = new THREE.Mesh(h.geometria, h.material);
          let aux=h.geometria.clone();
          //aux.position.set(f, k, c);
          aux.translate(f, k, c);

          arMesh.push(aux);
          //this.add(aux);
        }
      }
    }
    console.log(arMesh.length);

    this.final=new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(arMesh), h.material);

    this.add(this.final);

    let cristal = new cubos.Cristal();
    cristal.position.set(-5 * 16/ PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16/PM.PIXELES_ESTANDAR)
    let cristal2 = new cubos.Cristal();
    cristal2.position.set(-6 * 16/ PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16/PM.PIXELES_ESTANDAR)
    this.add(cristal2);
    this.add(cristal);


    this.arbol = new estructuras.ArbolRoble();
    this.add(this.arbol);
    //hoja.figura.position.set(0, 8/PM.PIXELES_ESTANDAR,0);
    //this.add(hoja.figura);
    this.cerdo = new Cerdo(this.gui, "Cerdo");
    this.add(this.cerdo);
  */

    const tamanochunk=10; //número de bloques por chunk
    const tileSize=16;
    const tileTextureWidth=256;
    const tileTextureHeight=64;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/minecraft/flourish-cc-by-nc-sa.png', this.render);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
  

    const material = new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
      transparent: true,
    });  
    this.world=new VoxelWorld({
      cellSize: tamanochunk,
      tileSize,
      tileTextureWidth,
      tileTextureHeight,
      material
    }, this)
    

    this.world.generarChunk(this);
  }


  initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append(stats.domElement);

    this.stats = stats;
  }

  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set(this.model.position.x, this.model.position.y + 10, this.model.position.z - 10);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.vector=new THREE.Vector3();
    this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControl.target.set(this.model.position.x, this.model.position.y, this.model.position.z)
    this.cameraControl.enablePan = false;
    this.cameraControl.enableZoom = false;
    this.cameraControl.rotateSpeed = 5;

    this.model.addCamara(this.cameraControl);
  }

  createGround() {
    // El suelo es un Mesh, necesita una geometría y un material.

    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry(50, 0.2, 50);

    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshPhongMaterial({ map: texture });

    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh(geometryGround, materialGround);

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add(ground);
  }

  createGUI() {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    // La escena le va a añadir sus propios controles.
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity: 0.5,
      axisOnOff: true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder('Luz y Ejes');

    // Se le añade un control para la intensidad de la luz
    folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange((value) => this.setLightIntensity(value));

    // Y otro para mostrar u ocultar los ejes
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    return gui;
  }

  createLights() {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add(ambientLight);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight(0xffffff, this.guiControls.lightIntensity);
    this.spotLight.position.set(60, 60, 40);
    this.add(this.spotLight);
  }

  setLightIntensity(valor) {
    this.spotLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    //console.log("tipo renderer: "+(typeof renderer.domElement))
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


  onDocumentMouseDown(event){
    /*let mouse= new THREE.Vector2();
    mouse.x=(event.clientX/window.innerWidth)*2-1;
    mouse.y=1-2*(event.clientY/window.innerHeight);

    let raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    //let prueba=[this.model.brazoLeftW1, this.model.brazoRightW1, this.model.cabezaW1]
    let objetos=raycaster.intersectObjects(this.arbol.array, true);

    console.log(objetos);
    if(objetos.length > 0){
      objetos[0].object.material.transparent=true;
      objetos[0].object.material.opacity=0;
    }*/
  }

  detectCollisionCharacterWorld(){
    this.model.boundingBox.geometry.computeBoundingBox();
    this.world.geometry.computeBoundingBox();
    this.model.boundingBox.updateMatrixWorld();
    this.world.mesh.updateMatrixWorld();

    let a=this.model.boundingBox.geometry.boundingBox.clone();
    a.applyMatrix4(this.model.boundingBox.matrixWorld);

    let b=this.world.geometry.boundingBox.clone();
    //console.log(b);
    b.applyMatrix4(this.world.mesh.matrixWorld);

    return a.intersectsBox(b);
  }

  update() {
    //console.log(this.cameraControl.object.position);
    if (this.stats) this.stats.update();

    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la posición de la cámara según su controlador    
    this.vector.subVectors(this.camera.position, this.cameraControl.target)
    /*
    this.cameraControl.object.position.copy(this.model.position).add(this.vector);
    this.cameraControl.target.copy(this.model.position);
*/
    let valores=new THREE.Vector3(this.model.position.x, this.model.position.y+36/PM.PIXELES_ESTANDAR, this.model.position.z);
    this.cameraControl.object.position.copy(valores).add(this.vector);
    this.cameraControl.target.copy(valores);

    this.cameraControl.update();

    // Se actualiza el resto del modelo
    this.model.update(this.movt);

    //this.ghost.update(this.movt);
    //this.ghost.resetPosicion();
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());
    

    let a=this.world.checkCollisionCharacter(this.model);
    console.log(a)

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())

  }
}

function checkKeys(scene) {
  if (scene.mapTeclas.W && scene.mapTeclas.A) {
    scene.movt = "upLeft";
  }
  else if (scene.mapTeclas.W && scene.mapTeclas.D) {
    scene.movt = "upRight";
  }
  else if (scene.mapTeclas.S && scene.mapTeclas.A) {
    scene.movt = "downLeft";
  }
  else if (scene.mapTeclas.S && scene.mapTeclas.D) {
    scene.movt = "downRight";
  }
  else if (scene.mapTeclas.W) {
    scene.movt = "adelante";
  }
  else if (scene.mapTeclas.A) {
    scene.movt = "strafeL";
  }
  else if (scene.mapTeclas.S) {
    scene.movt = "atras";
  }
  else if (scene.mapTeclas.D) {
    scene.movt = "strafeR";
  }
  else if (scene.mapTeclas[" "]) {
    scene.movt = "jump";
  }
}

/// La función   main
$(function () {
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");
  const canvas=scene.renderer.domElement

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  window.addEventListener("keydown", (event) => {
    let tecla = event.key.toUpperCase();

    scene.mapTeclas[tecla] = true;
    checkKeys(scene)

    //console.log(scene.mapTeclas);

    //Ahora toca la combinacion de teclas

  });


  window.addEventListener("keyup", (event) => {
    scene.mapTeclas[event.key.toUpperCase()] = false;
    //console.log(scene.mapTeclas);

    event.stopImmediatePropagation()

    let allFalse = true;

    for (let aux in scene.mapTeclas) {
      if (scene.mapTeclas[aux])
        allFalse = false;
    }

    if (allFalse) {
      scene.model.resetPosicion()
      scene.movt = "parado"
    }
    else {
      checkKeys(scene)
    }
  });

//----------------------------------------------------------------------------------------


const neighborOffsets = [
  [ 0,  0,  0], // self
  [-1,  0,  0], // left
  [ 1,  0,  0], // right
  [ 0, -1,  0], // down
  [ 0,  1,  0], // up
  [ 0,  0, -1], // back
  [ 0,  0,  1], // front
];


function updateVoxelGeometry(x, y, z) {
  const updatedCellIds = {};
  for (const offset of neighborOffsets) {
    const ox = x + offset[0];
    const oy = y + offset[1];
    const oz = z + offset[2];
    const cellId = scene.world.computeCellId(ox, oy, oz);
    if (!updatedCellIds[cellId]) {
      updatedCellIds[cellId] = true;
      scene.world.updateCellGeometry(ox, oy, oz,scene);
    }
  }
}

let currentVoxel = 1;//0;
//let currentId;

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  //console.log(canvas)
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function placeVoxel(event) {
  const pos = getCanvasRelativePosition(event);
  const x = (pos.x / canvas.width ) *  2 - 1;
  const y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  //console.log(pos.x);
  //console.log(pos.y);
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  start.setFromMatrixPosition(scene.camera.matrixWorld);
  end.set(x, y, 1).unproject(scene.camera);

  const intersection = scene.world.intersectRay(start, end);
  if (intersection) {
    const voxelId = event.shiftKey ? 0 : currentVoxel;
    // the intersection point is on the face. That means
    // the math imprecision could put us on either side of the face.
    // so go half a normal into the voxel if removing (currentVoxel = 0)
    // our out of the voxel if adding (currentVoxel  > 0)
    const pos = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });
    scene.world.setVoxel(...pos, voxelId);
    updateVoxelGeometry(...pos);
    //requestRenderIfNotRequested();
  }
}

const mouse = {
  x: 0,
  y: 0,
};

function recordStartPosition(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.moveX = 0;
  mouse.moveY = 0;
}
function recordMovement(event) {
  mouse.moveX += Math.abs(mouse.x - event.clientX);
  mouse.moveY += Math.abs(mouse.y - event.clientY);
}
function placeVoxelIfNoMovement(event) {
  if (mouse.moveX < 5 && mouse.moveY < 5) {
    placeVoxel(event);
  }
  window.removeEventListener('pointermove', recordMovement);
  window.removeEventListener('pointerup', placeVoxelIfNoMovement);
}
canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  recordStartPosition(event);
  window.addEventListener('pointermove', recordMovement);
  window.addEventListener('pointerup', placeVoxelIfNoMovement);
}, {passive: false});
canvas.addEventListener('touchstart', (event) => {
  // prevent scrolling
  event.preventDefault();
}, {passive: false});




//----------------------------------------------------------------------------------------
  window.addEventListener("mousedown", (event) => scene.onDocumentMouseDown(event));
  //window.addEventListener("click", ()=>scene.cameraControl.lock());
  // Que no se nos olvide, la primera visualización.
  scene.update();
});


