import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import * as PM from './ParametrosMundo.js'



//IMPORTANTE: LA CAMARA SE CENTRA EN LA CABEZA Y PIVOTA ALREDEDOR DE LA MISMA
class Zombie extends THREE.Object3D {
  degToRad(deg){
    return deg*(Math.PI/180)
  }
  constructor(gui,titleGui) {
    super();
    this.clock=new THREE.Clock();
    this.cambiarAnimacion=false;
    this.maxMovimientoExt=this.degToRad(60);
    //this.camara3rdPerson=new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.target=new THREE.Vector3(10, -5, 0);

    const textureLoader = new THREE.TextureLoader();
    const texturaCabeza = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cabezazneg.png"),
      }),
    ];
    
    //CABESA
    var geometriaCabeza = new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR);

    var cabeza = new THREE.Mesh(geometriaCabeza,texturaCabeza);

    cabeza.position.y=4/PM.PIXELES_ESTANDAR;

    this.cabezaW1=new THREE.Object3D();
    this.cabezaW1.add(cabeza);

    this.cabezaW1.position.y=24/PM.PIXELES_ESTANDAR;

    //this.add(this.cabezaW1);

    //BRAZOS Y PIERNAS

    const texturabrazoR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazozneg.png"),
      }),
    ];


    const texturabrazoL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazozposL.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/brazoznegL.png"),
      }),

    ];

    var geometriaExtremidad = new THREE.BoxGeometry(4/PM.PIXELES_ESTANDAR,12/PM.PIXELES_ESTANDAR,4/PM.PIXELES_ESTANDAR);
    var brazoL = new THREE.Mesh(geometriaExtremidad, texturabrazoL);

    //brazo izquierdo
    brazoL.position.y = -4/PM.PIXELES_ESTANDAR;
    var brazoR = brazoL.clone();
    
    brazoR.material = texturabrazoR;
    this.brazoLeft = new THREE.Object3D();

    this.brazoLeft.add(brazoL);
    this.brazoLeft.rotation.set(-Math.PI/2,0,0);

    //this.brazoLeft.rotation.x = 0.3;
    this.brazoLeft.position.y = 22/PM.PIXELES_ESTANDAR;

    this.brazoLeftW1 = new THREE.Object3D();
    this.brazoLeftW1.position.x = +6/PM.PIXELES_ESTANDAR;
    this.brazoLeftW1.add(this.brazoLeft);

    this.brazoRight = new THREE.Object3D();
    
    this.brazoRight.add(brazoR);
    this.brazoRight.rotation.set(-Math.PI/2,0,0);

    //this.brazoRight.rotation.x = -0.3;
    this.brazoRight.position.y = 22/PM.PIXELES_ESTANDAR;

    this.brazoRightW1 = new THREE.Object3D();
    this.brazoRightW1.position.x = -6/PM.PIXELES_ESTANDAR;
    this.brazoRightW1.add(this.brazoRight);


    //this.add(this.brazoLeftW1);
    //this.add(this.brazoRightW1);

    //Piernas

    const texturaPiernaR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernazposR.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernazneg.png"),
      }),
    ];

    const texturaPiernaL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/piernazneg.png"),
      }),
    ];
    //Izquierda
    var piernaL=new THREE.Mesh(geometriaExtremidad, texturaPiernaL);
    var piernaR=new THREE.Mesh(geometriaExtremidad, texturaPiernaR);

    piernaL.position.y=-6/PM.PIXELES_ESTANDAR;
    piernaR.position.y=-6/PM.PIXELES_ESTANDAR;

    this.piernaLW1=new THREE.Object3D();
    this.piernaRW1=new THREE.Object3D();

    this.piernaLW1.add(piernaL);
    this.piernaRW1.add(piernaR);

    this.piernaLW1.position.set(2/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 0);
    this.piernaRW1.position.set(-2/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 0);

    //this.add(this.piernaLW1);
    //this.add(this.piernaRW1);

    const texturaCuerpo = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/zombie/cuerpozneg.png"),
      }),
    ];
    //TORSO
    var geometriaTorso=new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 4/PM.PIXELES_ESTANDAR);

    var torso=new THREE.Mesh(geometriaTorso, texturaCuerpo);
    torso.position.y = 18/PM.PIXELES_ESTANDAR;
    //this.add(torso);


    //ESTO ES NECESARIO PARA QUE FUNCIONE LA ANIMACION DE STRAFE
    this.wrapperFinal=new THREE.Object3D();

    this.wrapperFinal.add(this.cabezaW1)
    this.wrapperFinal.add(this.brazoLeftW1)
    this.wrapperFinal.add(this.brazoRightW1)
    this.wrapperFinal.add(this.piernaLW1)
    this.wrapperFinal.add(this.piernaRW1)
    this.wrapperFinal.add(torso)
    
    this.add(this.wrapperFinal);
  }

  createGUI (gui,titleGui) {


    // Se crea una sección para los controles de la caja
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice

  }

  resetPosicion(){

  }

  update (movimiento) {

  }
}

export { Zombie };
