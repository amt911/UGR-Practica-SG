
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
      " ": false
    };

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
    this.axis = new THREE.AxesHelper(5);
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
    this.chunk=[];
    //this.bloques = [];  //BORRAR
    this.TAM_CHUNK = 4;
    this.DISTANCIA_RENDER = 3;
    this.h = new cubos.Hierba();
    let matrix = new THREE.Matrix4();
    noise.seed(Math.random());
    let amplitud = 1 + (Math.random() *45);
    let inc = 0.02;
    let xoff = 0;
    let zoff = 0;

    this.model.position.x=(this.DISTANCIA_RENDER*this.TAM_CHUNK)/2
    this.model.position.z=(this.DISTANCIA_RENDER*this.TAM_CHUNK)/2
    this.mesh = new THREE.InstancedMesh(this.h.geometria, this.h.material, this.TAM_CHUNK * this.TAM_CHUNK*this.TAM_CHUNK*this.DISTANCIA_RENDER*this.DISTANCIA_RENDER);
    let k=0;

    for (let i = 0; i < this.DISTANCIA_RENDER; i++) {   //PLANO XZ DE CHUNKS
      let bloques=[];
      for (let j = 0; j < this.DISTANCIA_RENDER; j++) {

        for (let x = i*this.TAM_CHUNK; x < (i * this.TAM_CHUNK) + this.TAM_CHUNK; x++) {   //PARA GENERAR LOS BLOQUES DE UN CHUNK
          for (let z = j*this.TAM_CHUNK; z < (j * this.TAM_CHUNK) + this.TAM_CHUNK ; z++) {
            xoff = inc*x;
            zoff= inc*z;
            
            let v = Math.round(noise.perlin2(xoff,  zoff) * amplitud / 1) * 1;
            //console.log(v);
            matrix.setPosition(x * 16 / PM.PIXELES_ESTANDAR, v -8 / PM.PIXELES_ESTANDAR, z* 16 / PM.PIXELES_ESTANDAR); 
            this.mesh.setMatrixAt(k, matrix);


            bloques.push({ x: x * 16 / PM.PIXELES_ESTANDAR, y: v -8 / PM.PIXELES_ESTANDAR, z: z* 16 / PM.PIXELES_ESTANDAR});
            k++;
            //bloques.push()
/*          RETOCAR, SIRVE PARA RELLENAR
            for(let y = v-1; y >= -6; y--){
              matrix.setPosition(x * 16 / PM.PIXELES_ESTANDAR + 8 / PM.PIXELES_ESTANDAR, y -8 / PM.PIXELES_ESTANDAR, z* 16 / PM.PIXELES_ESTANDAR + 8 / PM.PIXELES_ESTANDAR); 
              mesh.setMatrixAt(k, matrix);
  
  
              bloques.push({ x: x * 16 / PM.PIXELES_ESTANDAR + 8 / PM.PIXELES_ESTANDAR, y: y -8 / PM.PIXELES_ESTANDAR, z: z* 16 / PM.PIXELES_ESTANDAR + 8 / PM.PIXELES_ESTANDAR });
              k++;
            }
            */
          }
        }
        this.chunkCollision.push(bloques);
        //console.log(bloques)
        //console.log(bloques[bloques.length-1]);
        let chunkIndex=this.identificarChunk(bloques[0].x, bloques[0].z);
        //ASI NO SE INDEXAN LOS CHUNKS
        /*
        if(this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0]==undefined)
        this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0]=[];
        
        this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0][(bloques[bloques.length-1].z/this.DISTANCIA_RENDER) | 0]=bloques;
        */

        if(this.chunk[chunkIndex.x]==undefined)
        this.chunk[chunkIndex.x]=[];
        
        this.chunk[chunkIndex.x][chunkIndex.z]=bloques;        
      }
    }
    this.add(this.mesh);
    
    
/*
    for(let i=0; i<this.chunk.length; i++){
      for(let j=0; this.chunk[i]!=undefined && j<this.chunk[i].length; j++ ){
        for(let z=0; this.chunk[i][j]!=undefined && z<this.chunk[i][j].length; z++){
        let block = new THREE.BoxGeometry(1, 1, 1);
        block.translate(this.chunk[i][j][z].x, this.chunk[i][j][z].y, this.chunk[i][j][z].z);

        this.add(new THREE.Mesh(block, new THREE.MeshPhongMaterial({color: 0xff0000})))
      }
    }
    }
*/

    this.chunkMinMax={min: {x: 0, z: 0},
    max: {x: this.DISTANCIA_RENDER-1, z: this.DISTANCIA_RENDER-1}};

    //this.prueba=[[]]
    //this.prueba[3][5]="hola"
    //console.log(this.prueba)
    //this.prueba[3]=[]
    //console.log(this.prueba[3][1])
    //console.log(this.prueba[3][5])

    //console.log(3.5 | 0)

    this.bloqueRaro = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5));
    this.add(this.bloqueRaro);

    //this.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)))

    let cristal = new cubos.Cristal();
    cristal.position.set(-5 * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16 / PM.PIXELES_ESTANDAR)
    let cristal2 = new cubos.Cristal();
    cristal2.position.set(-6 * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, -2 * 16 / PM.PIXELES_ESTANDAR)
    this.add(cristal2);
    this.add(cristal);


    this.arbol = new estructuras.ArbolRoble();
    this.add(this.arbol);
    //hoja.figura.position.set(0, 8/PM.PIXELES_ESTANDAR,0);
    //this.add(hoja.figura);
    this.cerdo = new Cerdo(this.gui, "Cerdo");
    this.add(this.cerdo);


  }

  //ASI TAMPOCO SE INDEXAN
  //LA FORMULA ES: (X-X%TAM_CHUNK)/TAM_CHUNK DONDE X ES LA POSICION
  identificarChunk(x, z){
    let res={
      x: (x-(x%this.TAM_CHUNK))/this.TAM_CHUNK,
      z: (z-(z%this.TAM_CHUNK))/this.TAM_CHUNK
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
      axisOnOff: true
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


  onDocumentMouseDown(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    //let prueba=[this.model.brazoLeftW1, this.model.brazoRightW1, this.model.cabezaW1]
    let objetos = raycaster.intersectObject(this.mesh, true);

    //console.log(objetos[0]);
    if (objetos.length > 0) {
      //for(let i=0; i<objetos[0].object.material.length; i++){
      //  //objetos[0].object.material[i].transparent=true;
      //  //objetos[0].object.material[i].opacity=0;
      //  //objetos[0].object.material[i].color="0xffff00";
      //  let aux=objetos[0].object.material[i].clone();
      //  aux.color=0xff0000;
      //  objetos[0].object.material[i].dispose();
      //
      //  objetos[0].object.material[i]=aux
      //}
      //console.log(objetos[0].object.material)
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
    let aux=this.identificarChunk(this.model.position.x, this.model.position.z);

      //console.log("------------------------")
      //console.log(aux.z)
      //console.log(this.chunkMinMax.max.z)
      //console.log("________________________")
    if(aux.z>(this.chunkMinMax.min.z+this.chunkMinMax.max.z)/2){
      console.log(this.chunkMinMax.min.z);
      console.log(this.chunkMinMax.max.z);

      //Movemos los limites
      this.chunkMinMax.min.z++;
      this.chunkMinMax.max.z++;

      this.mesh = new THREE.InstancedMesh(this.h.geometria, this.h.material, this.TAM_CHUNK * this.TAM_CHUNK*this.TAM_CHUNK);
      let l=0;
      let amplitud = 1 + (Math.random() *45);
      let inc = 0.02;
      let xoff = 0;
      let zoff = 0;
      let matrix = new THREE.Matrix4();

      //Alternativa
      for(let i=this.chunkMinMax.min.x; i<=this.chunkMinMax.max.x; i++){
      //for(let i=aux.x-(this.DISTANCIA_RENDER)/2; i<=aux.x+(this.DISTANCIA_RENDER)/2; i++){
        if(this.chunk[i]!=undefined && this.chunk[i][this.chunkMinMax.z]!=undefined){
          for(let j=0; j<this.chunk[i][this.chunkMinMax.z].length; j++){
            console.log("genera los chunks existentes");
          }
        }
        else{
          if(this.chunk[i]==undefined)
            this.chunk[i]=[];
            //console.log("crear chunk")
          //Genera el chunk que no existia
          let bloques=[];
          for(let j=this.chunkMinMax.max.z*this.TAM_CHUNK; j<this.chunkMinMax.max.z*this.TAM_CHUNK+this.TAM_CHUNK; j++){
            for(let k=i*this.TAM_CHUNK; k<i*this.TAM_CHUNK+this.TAM_CHUNK; k++){
              xoff = inc*k;
              zoff= inc*j;
              
              let v = Math.round(noise.perlin2(xoff,  zoff) * amplitud / 1) * 1;
              //console.log(v);
              matrix.setPosition(k * 16 / PM.PIXELES_ESTANDAR, v -8 / PM.PIXELES_ESTANDAR, j* 16 / PM.PIXELES_ESTANDAR); 
              this.mesh.setMatrixAt(l, matrix);
  
              
              bloques.push({ x: k * 16 / PM.PIXELES_ESTANDAR, y: v -8 / PM.PIXELES_ESTANDAR, z: j* 16 / PM.PIXELES_ESTANDAR});
              console.log("position steve")
              console.log(this.model.position);
              console.log("fin position steve")
              console.log(bloques[bloques.length-1]);
              console.log("fin posicion cubo")
              l++;   
              let asd=new THREE.BoxGeometry(1, 1, 1);
              asd.translate(bloques[bloques.length-1].x, bloques[bloques.length-1].y, bloques[bloques.length-1].z)
              this.add(new THREE.Mesh(asd, new THREE.MeshPhongMaterial({color: 0xff0000})))
            }
          }

          this.chunkCollision.push(bloques);
          //console.log(bloques)
          //console.log(bloques[bloques.length-1]);
          let chunkIndex=this.identificarChunk(bloques[0].x, bloques[0].z);
          //ASI NO SE INDEXAN LOS CHUNKS
          /*
          if(this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0]==undefined)
          this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0]=[];
          
          this.chunk[(bloques[bloques.length-1].x/this.DISTANCIA_RENDER) | 0][(bloques[bloques.length-1].z/this.DISTANCIA_RENDER) | 0]=bloques;
          */
  
          if(this.chunk[chunkIndex.x]==undefined)
          this.chunk[chunkIndex.x]=[];
          
          this.chunk[chunkIndex.x][chunkIndex.z]=bloques;                  
        }

      }
    }


    this.model.update(this.movt, this.chunkCollision, this.bloqueRaro, this.mapTeclas);
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
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
    //checkKeys(scene)

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
    //else {
    //  checkKeys(scene)
    //}
  });

  //----------------------------------------------------------------------------------------
  window.addEventListener("mousedown", (event) => scene.onDocumentMouseDown(event));
  //window.addEventListener("click", ()=>scene.cameraControl.lock());
  // Que no se nos olvide, la primera visualización.
  scene.update();
});


