
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import { GUI } from '../libs/dat.gui.module.js'
import { OrbitControls } from '../libs/OrbitControls.js'
import { Stats } from '../libs/stats.module.js'
import { VoxelWorld } from './todo.js'
//import { Math } from '../libs/three.module.js'
// Clases de mi proyecto

import { Esteban } from './Esteban.js'
import { Zombie } from './Zombie.js'
import { Cerdo } from './Cerdo.js'

import * as cubos from './Cubo.js'
import * as estructuras from './estructuras.js'

import * as PM from './ParametrosMundo.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llelet el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  getCanvas() {
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
      " ": false,
      "SHIFT": false
    };

    //console.log((3.6|0)+0.5);
    //console.log(Math.round(3.6))

    this.myCanvasName = myCanvas;
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    this.initStats();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(letiable)
    this.createLights();

    // Tendremos una cámara con un control de movimiento con el ratón

    // Un suelo
    //this.createGround ();

    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper(55);
    this.add(this.axis);


    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    this.model = new Esteban(this.gui, "Controles de la Caja");
    this.createCamera();

    this.ghost = new Esteban(this.gui, " de la Caja");

    let path = "texturas/cielo/";
    let format = '.png';

    let urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
      //  path + 'py' + format, path + 'ny' + format,
      //  path + 'pz' + format, path + 'nz' + format
    ]

    let textureCube = new THREE.CubeTextureLoader().load(urls);

    this.background = textureCube;
    //this.add(this.ghost)
    this.add(this.model);

    this.zombie = new Zombie(this.gui, "Zombie");
    this.zombie.position.set(-3, 0, 0);
    this.add(this.zombie);

    this.chunkCollision = [];   //Almacena chunks
    this.chunk = [];
    this.TAM_CHUNK = 12;
    this.DISTANCIA_RENDER = 7;
    //this.TAM_CHUNK = 5;
    //this.DISTANCIA_RENDER = 7;    
    this.h = new cubos.Hierba();
    let matrix = new THREE.Matrix4();
    noise.seed(Math.random());
    this.amplitud = 1 + (Math.random() * 45);
    let inc = 0.02;
    let xoff = 0;
    let zoff = 0;

    this.p = new cubos.Piedra();
    this.t = new cubos.Tierra();

    this.model.position.x = (this.DISTANCIA_RENDER * this.TAM_CHUNK) / 2

    this.model.position.z = (this.DISTANCIA_RENDER * this.TAM_CHUNK) / 2

    this.objeto=0;
    this.bloqueSeleccionado=[
    "Hierba",
    "Tierra",
    "Roca",
    "Piedra",
    "MaderaRoble",
    "PiedraBase",
    "Cristal",
    "PiedraLuminosa",
    "HojasRoble"];

    this.materialesText={
      "Hierba": new cubos.Hierba().material,
      "Tierra": new cubos.Tierra().material,
      "Roca": new cubos.Roca().material,
      "Piedra": new cubos.Piedra().material,
      "MaderaRoble": new cubos.MaderaRoble().material,
      "PiedraBase": new cubos.PiedraBase().material,
      "Cristal": new cubos.Cristal().material,
      "PiedraLuminosa": new cubos.PiedraLuminosa().material,
      "HojasRoble": new cubos.HojaRoble().material
    }

    this.sizeIMesh = {
      "Hierba": 5 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER,
      "Tierra": 5 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER,
      "Roca": 0,
      "Piedra": 5 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER,
      "MaderaRoble": 1 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER,
      "PiedraBase": 1 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER,
      "Cristal": 1,
      "PiedraLuminosa": 1,
      "HojasRoble": 1 * this.TAM_CHUNK * this.TAM_CHUNK * this.DISTANCIA_RENDER * this.DISTANCIA_RENDER
    }

    this.mesh={
      "Hierba": new THREE.InstancedMesh(this.h.geometria, this.materialesText["Hierba"], this.sizeIMesh["Hierba"]),
      "Tierra": new THREE.InstancedMesh(this.t.geometria, this.materialesText["Tierra"], this.sizeIMesh["Tierra"]),
      "Roca": new THREE.InstancedMesh(this.p.geometria, this.materialesText["Roca"], this.sizeIMesh["Roca"]),
      "Piedra": new THREE.InstancedMesh(this.p.geometria, this.materialesText["Piedra"], this.sizeIMesh["Piedra"]),
      "MaderaRoble": new THREE.InstancedMesh(this.h.geometria, this.materialesText["MaderaRoble"], this.sizeIMesh["MaderaRoble"]),
      "PiedraBase": new THREE.InstancedMesh(this.p.geometria, this.materialesText["PiedraBase"], this.sizeIMesh["PiedraBase"]),
      "Cristal": new THREE.InstancedMesh(this.p.geometria, this.materialesText["Cristal"], this.sizeIMesh["Cristal"]),
      "PiedraLuminosa": new THREE.InstancedMesh(this.p.geometria, this.materialesText["PiedraLuminosa"], this.sizeIMesh["PiedraLuminosa"]),
      "HojasRoble": new THREE.InstancedMesh(this.h.geometria, this.materialesText["HojasRoble"], this.sizeIMesh["HojasRoble"])
    }

    let k = 0;
    //Arreglar esto
    let contador = 0;
    let contador2 = 0;
    let contador3 = 0;
    let contador4 = 0;
    let c = 0;

    for (let i = 0; i < this.DISTANCIA_RENDER; i++) {   //PLANO XZ DE CHUNKS
      for (let j = 0; j < this.DISTANCIA_RENDER; j++) {
        let bloques = [];

        for (let x = i * this.TAM_CHUNK; x < (i * this.TAM_CHUNK) + this.TAM_CHUNK; x++) {   //PARA GENERAR LOS BLOQUES DE UN CHUNK
          for (let z = j * this.TAM_CHUNK; z < (j * this.TAM_CHUNK) + this.TAM_CHUNK; z++) {
            //contador=contador2=0;
            xoff = inc * x;
            zoff = inc * z;

            let v = Math.round(noise.perlin2(xoff, zoff) * this.amplitud / 1) * 1;
            //console.log(v);
            matrix.setPosition(x * 16 / PM.PIXELES_ESTANDAR, v - 8 / PM.PIXELES_ESTANDAR, z * 16 / PM.PIXELES_ESTANDAR);
            this.mesh["Hierba"].setMatrixAt(k, matrix);


            bloques.push({ x: x * 16 / PM.PIXELES_ESTANDAR, y: v - 8 / PM.PIXELES_ESTANDAR, z: z * 16 / PM.PIXELES_ESTANDAR, material: "Hierba"});
            k++; 
            let arbol = new estructuras.ArbolRoble();
            for(let r = 0; r < arbol.bloqueshojas.length; r++){
              matrix.setPosition(c + arbol.bloqueshojas[r].x, v + arbol.bloqueshojas[r].y, c + arbol.bloqueshojas[r].z);
              this.mesh["HojasRoble"].setMatrixAt(contador3, matrix);
              bloques.push({x: c + arbol.bloqueshojas[r].x, y: v + arbol.bloqueshojas[r].y, z:  c + arbol.bloqueshojas[r].z, material: "HojasRoble"});
              contador3++;
            }

            for(let r = 0; r < arbol.bloquesmadera.length; r++){
              matrix.setPosition( c + arbol.bloquesmadera[r].x, v+ arbol.bloquesmadera[r].y, c + arbol.bloquesmadera[r].z);
              this.mesh["MaderaRoble"].setMatrixAt(contador4, matrix);
              bloques.push({x: c + arbol.bloquesmadera[r].x, y: v + arbol.bloquesmadera[r].y, z: c + arbol.bloquesmadera[r].z, material: "MaderaRoble"});
              contador4++;
            }

            c++;
            for(let s = 0; s < 3; s++){
              matrix.setPosition(x * 16 / PM.PIXELES_ESTANDAR, v - 8 / PM.PIXELES_ESTANDAR - s -1, z * 16 / PM.PIXELES_ESTANDAR);
              this.mesh["Tierra"].setMatrixAt(contador, matrix);
              
              
              bloques.push({ x: x * 16 / PM.PIXELES_ESTANDAR, y: v - 8 / PM.PIXELES_ESTANDAR - s -1, z: z * 16 / PM.PIXELES_ESTANDAR, material: "Tierra" });
              contador++;
            }
           /* */
            for(let r = 3; r < 8; r++){
              matrix.setPosition(x * 16 / PM.PIXELES_ESTANDAR, v - 8 / PM.PIXELES_ESTANDAR - r - 1 , z * 16 / PM.PIXELES_ESTANDAR);
              this.mesh["Piedra"].setMatrixAt(contador2, matrix);
  
              
              bloques.push({ x: x * 16 / PM.PIXELES_ESTANDAR, y: v - 8 / PM.PIXELES_ESTANDAR - r -1, z: z * 16 / PM.PIXELES_ESTANDAR, material: "Piedra" });
              contador2++;
            }
          }
        }
        this.chunkCollision.push(bloques);
        let chunkIndex = this.identificarChunk(bloques[0].x, bloques[0].z);

        if (this.chunk[chunkIndex.x] == undefined)
          this.chunk[chunkIndex.x] = [];

        this.chunk[chunkIndex.x][chunkIndex.z] = bloques;
      }
    }

    for(let aux in this.mesh){
      this.add(this.mesh[aux]);
    }


    this.chunkMinMax = {
      min: { x: 0, z: 0 },
      max: { x: this.DISTANCIA_RENDER - 1, z: this.DISTANCIA_RENDER - 1 }
    };

/*     //this.bloqueRaro = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5));
    this.bloqueRaro = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    this.add(this.bloqueRaro);

    let cristal = new cubos.Cristal();
    cristal.position.set(-5 * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16 / PM.PIXELES_ESTANDAR)
    let cristal2 = new cubos.Cristal();
    cristal2.position.set(-6 * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16 / PM.PIXELES_ESTANDAR)
    this.add(cristal2);
    this.add(cristal);

    let glowstone = new cubos.PiedraLuminosa();
    let mesh = new THREE.Mesh(glowstone.geometria, glowstone.material);
    mesh.position.set(-7, 0.5, -2);

    this.add(mesh); */


    
    this.cerdo = new Cerdo(this.gui, "Cerdo");
    this.add(this.cerdo);

    let cajaSeleccionada=new THREE.BoxGeometry(1,1,1);
    this.cajaSeleccionada=new THREE.Mesh(cajaSeleccionada);

    this.add(this.cajaSeleccionada);

    this.cajaSeleccionada.material.wireframe = true;
    this.cajaSeleccionada.material.wireframeLinewidth = 3;
    this.cajaSeleccionada.material.color.set(0x333333);
    this.cajaSeleccionada.visible = false;
  }

  //ASI TAMPOCO SE INDEXAN
  //LA FORMULA ES: (X-X%TAM_CHUNK)/TAM_CHUNK DONDE X ES LA POSICION
  identificarChunk(x, z) {
    let res = {
      x: Math.round((x - (x % this.TAM_CHUNK)) / this.TAM_CHUNK),
      z: Math.round((z - (z % this.TAM_CHUNK)) / this.TAM_CHUNK)
    }

    return res;
  }


  initStats() {

    let stats = new Stats();

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
    this.vector = new THREE.Vector3();
    this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControl.target.set(this.model.position.x, this.model.position.y, this.model.position.z)
    this.cameraControl.enablePan = false;
    this.cameraControl.enableZoom = false;
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.mouseButtons={
      LEFT: THREE.MOUSE.DOLLY,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.PAN      
    }

    this.model.addCamara(this.cameraControl);
  }

  createGround() {
    // El suelo es un Mesh, necesita una geometría y un material.

    // La geometría es una caja con muy poca altura
    let geometryGround = new THREE.BoxGeometry(50, 0.2, 50);

    // El material se hará con una textura de madera
    let texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    let materialGround = new THREE.MeshPhongMaterial({ map: texture });

    // Ya se puede construir el Mesh
    let ground = new THREE.Mesh(geometryGround, materialGround);

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add(ground);
  }

  createGUI() {
    // Se crea la interfaz gráfica de usuario
    let gui = new GUI();

    // La escena le va a añadir sus propios controles.
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity: 0.5,
      axisOnOff: true,
      activarWireframe: false
    }

    // Se crea una sección para los controles de esta clase
    let folder = gui.addFolder('Luz y Ejes');

    // Se le añade un control para la intensidad de la luz
    folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange((value) => this.setLightIntensity(value));

    // Y otro para mostrar u ocultar los ejes
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    folder.add(this.guiControls, 'activarWireframe')
      .name('Mostrar feedback (mejora los FPS si se desactiva): ');

    return gui;
  }

  createLights() {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   let   y va a ser una letiable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    let ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
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
    let renderer = new THREE.WebGLRenderer();

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
    // Si hubiera letias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
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


  //PONER BLOQUES: ARREGLAR QUE NO SE PUEDAN PONER BLOQUES CUANDO EL PERSONAJE COLISIONE CON EL NUEVO
  onDocumentMouseDown(event) {
    
    if (event.which == 3) {
      let mouse = new THREE.Vector2();

      mouse.x = (0.5) * 2 - 1;
      mouse.y = 1 - 2 * (0.5);

      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      let objetosIntersecados=[];
      for(let tipo in this.mesh){
        let objetos = raycaster.intersectObject(this.mesh[tipo], true);

        if (objetos[0] != undefined && objetos.length > 0 && objetos[0].distance <= 20) {
          let index = objetos[0].face.materialIndex;
          let posicion = objetos[0].point;
          let coord = { x: 0, y: 0, z: 0 };

          //IMPORTANTE REVISAR 0 Y 5 (LOS INCREMENTOS)
          switch (index) {
            case 0: //derecha (x pos)
              coord = {
                x: posicion.x + 0.5,
                //y: Math.round(posicion.y) + 0.5,
                y: (posicion.y | 0) + 0.5,// + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 1: //izquierda (x neg)
              coord = {
                x: posicion.x - 0.5,
                //y: Math.round(posicion.y) + 0.5,
                y: (posicion.y|0) + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 2: //arriba (y pos)
              coord = {
                x: Math.round(posicion.x),
                y: (posicion.y|0) + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 3: //abajo (y neg)
              coord = {
                x: Math.round(posicion.x),
                y: (posicion.y|0) - 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 4: //frente (z pos)
              coord = {
                x: Math.round(posicion.x),
                //y: Math.round(posicion.y) + 0.5,// + 0.5,
                y: (posicion.y|0) + 0.5,// + 0.5,
                z: posicion.z + 0.5
              }
              break;
            case 5: //detras (z neg)
              coord = {
                x: Math.round(posicion.x),
                //y: Math.round(posicion.y) + 0.5,
                y: (posicion.y|0) + 0.5,
                z: posicion.z - 0.5
              }
              break;
          }
          if(posicion.y<0){
            //console.log("-----------------------")
            coord.y=Math.floor(posicion.y)+0.5;
            //console.log(coord.y);
            //console.log(Math.floor((posicion.y)|0)+0.5)
            //console.log("_______________________")
            //coord.y=Math.floor((posicion.y)|0)+0.5;
          }

          objetosIntersecados.push({tipo: tipo, coordenada: coord, distancia: objetos[0].distance});

        }

      }

      //ordena objetos intersecados segun distancia
      objetosIntersecados.sort(function(a, b){
        return a.distancia - b.distancia;
      });
      
      //console.log(objetosIntersecados);


      //let aux = this.identificarChunk(coord.x, coord.z);      
      let aux = this.identificarChunk(objetosIntersecados[0].coordenada.x, objetosIntersecados[0].coordenada.z);
      this.chunk[aux.x][aux.z].push( {material: this.bloqueSeleccionado[this.objeto], x: objetosIntersecados[0].coordenada.x, y: objetosIntersecados[0].coordenada.y, z: objetosIntersecados[0].coordenada.z} );
      this.remove(this.mesh[this.bloqueSeleccionado[this.objeto]]);

      
      let matrix = new THREE.Matrix4();
      let l = 0;

      console.log(this.bloqueSeleccionado[this.objeto])
      this.mesh[this.bloqueSeleccionado[this.objeto]] = new THREE.InstancedMesh(this.h.geometria, this.materialesText[this.bloqueSeleccionado[this.objeto]], ++this.sizeIMesh[this.bloqueSeleccionado[this.objeto]]);
      console.log(this.sizeIMesh[this.bloqueSeleccionado[this.objeto]])
      for (let a = this.chunkMinMax.min.z; a <= this.chunkMinMax.max.z; a++) {
        for (let i = this.chunkMinMax.min.x; i <= this.chunkMinMax.max.x; i++) {
          for (let j = 0; j < this.chunk[i][a].length; j++) {
            if(this.chunk[i][a][j].material == this.bloqueSeleccionado[this.objeto]){//objetosIntersecados[0].tipo){
              matrix.setPosition(this.chunk[i][a][j].x, this.chunk[i][a][j].y, this.chunk[i][a][j].z);
              this.mesh[this.bloqueSeleccionado[this.objeto]].setMatrixAt(l, matrix);
              l++;
            }
          }
        }
      }

      
      //console.log(objetosIntersecados[0].tipo);
      //console.log(this.mesh[objetosIntersecados[0].tipo]);
      this.add(this.mesh[this.bloqueSeleccionado[this.objeto]]);
    }

    else if (event.which == 1) {
      let mouse = new THREE.Vector2();
      //mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      //mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

      mouse.x = (0.5) * 2 - 1;
      mouse.y = 1 - 2 * (0.5);

      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      let objetosIntersecados = [];
      for (let tipo in this.mesh) {
        let objetos = raycaster.intersectObject(this.mesh[tipo], true);

        //console.log("------------------------");
        //console.log(objetos[0].face.materialIndex);
        //console.log(objetos[0]);
        //console.log(this.model.position)
        //console.log("________________________")
        if (objetos[0] != undefined && objetos.length > 0 && objetos[0].distance <= 20) {
          let index = objetos[0].face.materialIndex;
          let posicion = objetos[0].point;
          let coord = { x: 0, y: 0, z: 0 };

          //IMPORTANTE REVISAR 0 Y 5 (LOS INCREMENTOS)
          switch (index) {
            case 0: //derecha (x pos)
              coord = {
                x: posicion.x - 0.5,
                //y: Math.round(posicion.y)+0.5,
                y: (posicion.y | 0) + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 1: //izquierda (x neg)
              coord = {
                x: posicion.x + 0.5,
                //y: Math.round(posicion.y)+0.5,
                y: (posicion.y | 0) + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 2: //arriba (y pos) ok
              coord = {
                x: Math.round(posicion.x),
                y: posicion.y - 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 3: //abajo (y neg)
              coord = {
                x: Math.round(posicion.x),
                y: posicion.y + 0.5,
                z: Math.round(posicion.z)
              }
              break;
            case 4: //frente (z pos)
              coord = {
                x: Math.round(posicion.x),
                //y: Math.round(posicion.y)+0.5,
                y: (posicion.y | 0) + 0.5,
                z: posicion.z - 0.5
              }
              break;
            case 5: //detras (z neg)
              coord = {
                x: Math.round(posicion.x),
                //y: Math.round(posicion.y)+0.5,
                y: (posicion.y | 0) + 0.5,
                z: posicion.z + 0.5
              }
              break;
          }

          if (posicion.y < 0 && index != 3 && index != 2) {
            coord.y = Math.floor(posicion.y) + 0.5;
          }

          let redondeo = Math.round(coord.y);

          coord.y = (redondeo > coord.y) ? redondeo - 0.5 : redondeo + 0.5;

          objetosIntersecados.push({ tipo: tipo, coordenada: coord, distancia: objetos[0].distance });



        }

      }

      //ordena objetos intersecados segun distancia
      objetosIntersecados.sort(function(a, b){
        return a.distancia - b.distancia;
      });
      
      let aux = this.identificarChunk(objetosIntersecados[0].coordenada.x, objetosIntersecados[0].coordenada.z);
      this.remove(this.mesh[objetosIntersecados[0].tipo]);

      let indice = this.chunk[aux.x][aux.z].findIndex(i => i.x == objetosIntersecados[0].coordenada.x && i.y == objetosIntersecados[0].coordenada.y && i.z == objetosIntersecados[0].coordenada.z);   //SUponemos que no puede haber dos bloques en la misma posicion

      if (indice != -1)
        this.chunk[aux.x][aux.z].splice(indice, 1);

      let matrix = new THREE.Matrix4();

      let l = 0;
      this.mesh[objetosIntersecados[0].tipo] = new THREE.InstancedMesh(this.h.geometria, this.materialesText[objetosIntersecados[0].tipo], --this.sizeIMesh[objetosIntersecados[0].tipo]);


      for (let a = this.chunkMinMax.min.z; a <= this.chunkMinMax.max.z; a++) {
        for (let i = this.chunkMinMax.min.x; i <= this.chunkMinMax.max.x; i++) {
          for (let j = 0; j < this.chunk[i][a].length; j++) {
            if(this.chunk[i][a][j].material == objetosIntersecados[0].tipo){
              matrix.setPosition(this.chunk[i][a][j].x, this.chunk[i][a][j].y, this.chunk[i][a][j].z);
              this.mesh[objetosIntersecados[0].tipo].setMatrixAt(l, matrix);
              l++;
            }
          }
        }
      }

      //console.log(objetosIntersecados[0].tipo);
      this.add(this.mesh[objetosIntersecados[0].tipo]);
    }

  }

  detectCollisionCharacterWorld() {
    this.model.boundingBox.geometry.computeBoundingBox();
    this.world.geometry.computeBoundingBox();
    this.model.boundingBox.updateMatrixWorld();
    this.world.mesh.updateMatrixWorld();

    let a = this.model.boundingBox.geometry.boundingBox.clone();
    a.applyMatrix4(this.model.boundingBox.matrixWorld);

    let b = this.world.geometry.boundingBox.clone();
    b.applyMatrix4(this.world.mesh.matrixWorld);

    return a.intersectsBox(b);
  }

  actualizarFeedback(){
    let mouse = new THREE.Vector2();

    mouse.x = (0.5) * 2 - 1;
    mouse.y = 1 - 2 * (0.5);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    let objetosSeleccionados=[];

    for(let aux in this.mesh){
      let objetos = raycaster.intersectObject(this.mesh[aux], true);

      if (objetos[0] != undefined && objetos.length > 0 && objetos[0].distance <= 20) {
        let index = objetos[0].face.materialIndex;
        let posicion = objetos[0].point;
        let coord = { x: 0, y: 0, z: 0 };
  
        //IMPORTANTE REVISAR 0 Y 5 (LOS INCREMENTOS)
        switch (index) {
          case 0: //derecha (x pos)
            coord = {
              x: posicion.x - 0.5,
              //y: Math.round(posicion.y)+0.5,
              y: (posicion.y|0)+0.5,
              z: Math.round(posicion.z)
            }
            break;
          case 1: //izquierda (x neg)
            coord = {
              x: posicion.x + 0.5,
              //y: Math.round(posicion.y)+0.5,
              y: (posicion.y|0)+0.5,
              z: Math.round(posicion.z)
            }
            break;
          case 2: //arriba (y pos) ok
            coord = {
              x: Math.round(posicion.x),
              y: posicion.y - 0.5,
              z: Math.round(posicion.z)
            }
            break;
          case 3: //abajo (y neg)
            coord = {
              x: Math.round(posicion.x),
              y: posicion.y + 0.5,
              z: Math.round(posicion.z)
            }
            break;
          case 4: //frente (z pos)
            coord = {
              x: Math.round(posicion.x),
              //y: Math.round(posicion.y)+0.5,
              y: (posicion.y|0)+0.5,
              z: posicion.z - 0.5
            }
            break;
          case 5: //detras (z neg)
            coord = {
              x: Math.round(posicion.x),
              //y: Math.round(posicion.y)+0.5,
              y: (posicion.y|0)+0.5,
              z: posicion.z + 0.5
            }
            break;
        }
  
        if(posicion.y<0 && index!=3 && index!=2){
          coord.y=Math.floor(posicion.y)+0.5;
        }

        objetosSeleccionados.push({objeto: objetos[0], coordenadas: coord});
      }      
    }

    //console.log("------------------------");
    //console.log(objetos[0].face.materialIndex);
    //console.log(objetos[0]);
    //console.log(this.model.position)
    //console.log("________________________")

    //Ordena objetosSeleccionados por distancia
    objetosSeleccionados.sort(function (a, b) {
      return a.objeto.distance - b.objeto.distance;
    });

    if (objetosSeleccionados.length > 0) {
      this.cajaSeleccionada.position.set(objetosSeleccionados[0].coordenadas.x, objetosSeleccionados[0].coordenadas.y, objetosSeleccionados[0].coordenadas.z);
      this.cajaSeleccionada.visible=true;
    }
    else{
      //Pone la caja seleccionada invisible
      this.cajaSeleccionada.visible=false;
    }    
  }

  update() {
    if (this.stats) this.stats.update();

    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la posición de la cámara según su controlador    
    this.vector.subVectors(this.camera.position, this.cameraControl.target)

    let valores = new THREE.Vector3(this.model.position.x, this.model.position.y + 36 / PM.PIXELES_ESTANDAR, this.model.position.z);
    this.cameraControl.object.position.copy(valores).add(this.vector);
    this.cameraControl.target.copy(valores);

    this.cameraControl.update();

    //console.log(this.mapTeclas);
    // Se actualiza el resto del modelo

    //console.log(this.identificarChunk(this.model.position.x, this.model.position.z))

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());
    let aux = this.identificarChunk(this.model.position.x, this.model.position.z);

    //console.log("chunk: " + aux.x + " " + aux.z);
    //console.log("------------------------")
    //console.log(aux.z)
    //console.log(this.chunkMinMax.max.z)
    //console.log("________________________")
    let renderChunksAgain = false;
    if (aux.z > (this.chunkMinMax.min.z + this.chunkMinMax.max.z) / 2) {
      //console.log(this.chunkMinMax.min.z);
      //console.log(this.chunkMinMax.max.z);

     // console.log("entra1")
      //Movemos los limites
      this.chunkMinMax.min.z++;
      this.chunkMinMax.max.z++;
      renderChunksAgain = true;
    }

    //Revisar el >=0
    if (aux.z < (this.chunkMinMax.min.z + this.chunkMinMax.max.z) / 2 && aux.z >= 0) {
      //console.log("entra2")
      this.chunkMinMax.min.z--;
      this.chunkMinMax.max.z--;
      renderChunksAgain = true;
    }

    //Parte para las x
    if (aux.x > (this.chunkMinMax.min.x + this.chunkMinMax.max.x) / 2) {
      //console.log(this.chunkMinMax.min.z);
      //console.log(this.chunkMinMax.max.z);

      //console.log("entra3")
      //Movemos los limites
      this.chunkMinMax.min.x++;
      this.chunkMinMax.max.x++;
      renderChunksAgain = true;
    }

    if (aux.x < (this.chunkMinMax.min.x + this.chunkMinMax.max.x) / 2 && aux.x >= 0) {
      //console.log("entra4")
      this.chunkMinMax.min.x--;
      this.chunkMinMax.max.x--;
      renderChunksAgain = true;
    }

    //console.log(this.chunkMinMax.min);
    //console.log(this.chunkMinMax.max);

    if (renderChunksAgain) {
      for(let tipo in this.mesh){      
        this.remove(this.mesh[tipo]);
        this.mesh[tipo] = new THREE.InstancedMesh(this.h.geometria, this.materialesText[tipo], this.sizeIMesh[tipo]);
      }
      

        let l = {
          "Hierba": 0,
          "Tierra": 0,
          "Piedra": 0,
          "MaderaRoble": 0,
          "HojasRoble": 0,
          "Roca": 0,
          "PiedraBase": 0,
          "PiedraLuminosa": 0,
          "Cristal": 0
        };

        let inc = 0.02;
        let xoff = 0;
        let zoff = 0;
        let matrix = new THREE.Matrix4();

        //Alternativa
        for (let a = this.chunkMinMax.min.z; a <= this.chunkMinMax.max.z; a++) {
          for (let i = this.chunkMinMax.min.x; i <= this.chunkMinMax.max.x; i++) {
            if (this.chunk[i] != undefined && this.chunk[i][a] != undefined) {
              for (let j = 0; j < this.chunk[i][a].length; j++) {
                //console.log(this.chunk[i][a][j].material);
                matrix.setPosition(this.chunk[i][a][j].x, this.chunk[i][a][j].y, this.chunk[i][a][j].z);
                this.mesh[this.chunk[i][a][j].material].setMatrixAt(l[this.chunk[i][a][j].material], matrix);
                l[this.chunk[i][a][j].material]++;
              }
            }
            else {
              if (this.chunk[i] == undefined)
                this.chunk[i] = [];
              //Genera el chunk que no existia
              let bloques = [];
              for (let j = a * this.TAM_CHUNK; j < a * this.TAM_CHUNK + this.TAM_CHUNK; j++) {
                for (let k = i * this.TAM_CHUNK; k < i * this.TAM_CHUNK + this.TAM_CHUNK; k++) {
                  xoff = inc * k;
                  zoff = inc * j;

                  let v = Math.round(noise.perlin2(xoff, zoff) * this.amplitud / 1) * 1;
                  matrix.setPosition(k * 16 / PM.PIXELES_ESTANDAR, v - 8 / PM.PIXELES_ESTANDAR, j * 16 / PM.PIXELES_ESTANDAR);
                  this.mesh["Hierba"].setMatrixAt(l["Hierba"], matrix);

                  bloques.push({ x: k * 16 / PM.PIXELES_ESTANDAR, y: v - 8 / PM.PIXELES_ESTANDAR, z: j * 16 / PM.PIXELES_ESTANDAR, material: "Hierba" });
                  l["Hierba"]++;
                }
              }

              this.chunkCollision.push(bloques);
              let chunkIndex = this.identificarChunk(bloques[0].x, bloques[0].z);

              if (this.chunk[chunkIndex.x] == undefined)
                this.chunk[chunkIndex.x] = [];

              this.chunk[chunkIndex.x][chunkIndex.z] = bloques;
            }

          }
        }

        for(let tipo in this.mesh){
          this.add(this.mesh[tipo])
        }
      
    }


    //Lanza Raycaster para poner el cubo wireframe en el lugar correcto
    if(this.guiControls.activarWireframe){
      this.actualizarFeedback();
    }
    else{
      //Se pone el cubo no visible
      this.cajaSeleccionada.visible = false;
    }


    this.model.update(this.movt, this.chunkCollision, this.bloqueRaro, this.mapTeclas);
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }

  onDocumentWheel(event) {
    let tiles=document.getElementsByClassName("tile");

    tiles[this.objeto].style.border="";

    if(event.deltaY>0){
      this.objeto=(this.objeto+1)%tiles.length;
    }
    else{
      if(this.objeto==0)
        this.objeto=tiles.length-1;
      else
        this.objeto--;
    }

    tiles[this.objeto].style.border="3px solid black";
  }
}


/// La función   main
$(function () {
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  let scene = new MyScene("#WebGL-output");
  const canvas = scene.renderer.domElement

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  window.addEventListener("keydown", (event) => {
    let tecla = event.key.toUpperCase();

    scene.mapTeclas[tecla] = true;
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
    //else {
    //  checkKeys(scene)
    //}
  });

  //----------------------------------------------------------------------------------------
  window.addEventListener("mousedown", (event) => scene.onDocumentMouseDown(event));
  window.addEventListener("wheel", (event) => scene.onDocumentWheel(event));
  //window.addEventListener("click", ()=>scene.cameraControl.lock());
  // Que no se nos olvide, la primera visualización.
  scene.update();
});