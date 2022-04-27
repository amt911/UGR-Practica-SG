import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'
class Esteban extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    var material = new THREE.MeshPhongMaterial({color: 0xCF0000, flatShading:true});

    //alert(PM.PIXELES_ESTANDAR);
    //alert(PM.PIXELES_ESTANDAR)
    //CABESA
    var geometriaCabeza = new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR);

    //geometriaCabeza.translate(0, 4/PM.PIXELES_ESTANDAR, 0);

    var cabeza = new THREE.Mesh(geometriaCabeza,material);

    cabeza.position.y=4/PM.PIXELES_ESTANDAR;

    this.cabezaW1=new THREE.Object3D();
    this.cabezaW1.add(cabeza);

    //cabezaW1.rotation.y=this.guiControls.cabezaY;
    //cabezaW1.rotation.x=this.guiControls.cabezaX;

    //this.cabezaW1.rotation.x=0.5;
    //this.cabezaW1.rotation.y=0.5;
    this.cabezaW1.position.y=24/PM.PIXELES_ESTANDAR;
    //cabeza.position.y=4/PM.PIXELES_ESTANDAR;



    this.add(this.cabezaW1);

    //BRAZOS Y PIERNAS
    var geometriaExtremidad = new THREE.BoxGeometry(4/PM.PIXELES_ESTANDAR,12/PM.PIXELES_ESTANDAR,4/PM.PIXELES_ESTANDAR);
    var brazoL = new THREE.Mesh(geometriaExtremidad, material);

    //brazo izquierdo
    brazoL.position.y = -4/PM.PIXELES_ESTANDAR;
    var brazoR = brazoL.clone();

    this.brazoLeft = new THREE.Object3D();
    this.brazoLeft.add(brazoL);
    this.brazoLeft.rotation.x = 0.3;
    this.brazoLeft.position.y = 22/PM.PIXELES_ESTANDAR;

    this.brazoLeftW1 = new THREE.Object3D();
    this.brazoLeftW1.position.x = +6/PM.PIXELES_ESTANDAR;
    this.brazoLeftW1.add(this.brazoLeft);

    this.brazoRight = new THREE.Object3D();
    this.brazoRight.add(brazoR);
    this.brazoRight.rotation.x = -0.3;
    this.brazoRight.position.y = 22/PM.PIXELES_ESTANDAR;

    this.brazoRightW1 = new THREE.Object3D();
    this.brazoRightW1.position.x = -6/PM.PIXELES_ESTANDAR;
    this.brazoRightW1.add(this.brazoRight);


    this.add(this.brazoLeftW1);
    this.add(this.brazoRightW1);
  //  this.add(extremidad);

    //Piernas

    //Izquierda
    var piernaL=new THREE.Mesh(geometriaExtremidad, material);
    var piernaR=piernaL.clone();

    piernaL.position.y=-6/PM.PIXELES_ESTANDAR;
    piernaR.position.y=-6/PM.PIXELES_ESTANDAR;

    this.piernaLW1=new THREE.Object3D();
    this.piernaRW1=new THREE.Object3D();

    this.piernaLW1.add(piernaL);
    this.piernaRW1.add(piernaR);

    this.piernaLW1.rotation.x=0.5;    //
    this.piernaRW1.rotation.x=-0.5;   //

    this.piernaLW1.position.set(2/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 0);
    this.piernaRW1.position.set(-2/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 0);

    this.add(this.piernaLW1);
    this.add(this.piernaRW1);


    //TORSO
    var geometriaTorso=new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 4/PM.PIXELES_ESTANDAR);

    var torso=new THREE.Mesh(geometriaTorso, material);
    torso.position.y = 18/PM.PIXELES_ESTANDAR;

    this.add(torso);
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      cabezaX: 0,
      cabezaY: 0,
      piernaL: 0,
      piernaR: 0,
      giroY: 0,
      brazoL: 0,
      brazoR: 0,

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.cabezaX=0;
        this.guiControls.cabezaY=0;
        this.guiControls.piernaL=0;
        this.guiControls.piernaR=0;
        this.guiControls.giroY=0;
        this.guiControls.brazoL=0;
        this.guiControls.brazoR=0;
      }
    }

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'cabezaY', -Math.PI/2, Math.PI/2, 0.1).name ('Cabeza Y : ').listen();
    folder.add (this.guiControls, 'cabezaX', -Math.PI/2, Math.PI/2, 0.1).name ('Cabeza X : ').listen();

    folder.add (this.guiControls, 'piernaL', -Math.PI/2, Math.PI/2, 0.1).name ('Pierna L : ').listen();
    folder.add (this.guiControls, 'piernaR', -Math.PI/2, Math.PI/2, 0.1).name ('Pierna R : ').listen();

    folder.add (this.guiControls, 'brazoL', -Math.PI/2, Math.PI/2, 0.1).name ('Brazo L : ').listen();
    folder.add (this.guiControls, 'brazoR', -Math.PI/2, Math.PI/2, 0.1).name ('Brazo R : ').listen();

    folder.add (this.guiControls, 'giroY', -Math.PI/2, Math.PI/2, 0.1).name ('Giro Esteban: ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  update () {
    this.cabezaW1.rotation.y=this.guiControls.cabezaY;
    this.cabezaW1.rotation.x=this.guiControls.cabezaX;

    this.piernaLW1.rotation.x=this.guiControls.piernaL;    //
    this.piernaRW1.rotation.x=this.guiControls.piernaR;
    this.brazoLeft.rotation.x=this.guiControls.brazoL;    //
    this.brazoRight.rotation.x=this.guiControls.brazoR;

    this.rotation.y=this.guiControls.giroY;
  }
}

export { Esteban };
