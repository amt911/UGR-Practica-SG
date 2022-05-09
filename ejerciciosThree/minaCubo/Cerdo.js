import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'



//IMPORTANTE: LA CAMARA SE CENTRA EN LA CABEZA Y PIVOTA ALREDEDOR DE LA MISMA
class Cerdo extends THREE.Object3D {
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
    this.material = new THREE.MeshPhongMaterial({color: 0x2dc100});
        const textureLoader = new THREE.TextureLoader();


    //HOCICO

    const texturaHocico = [
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicoxpos.png"),
        }),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicoxneg.png"),
        }),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicoypos.png"),
        }),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicoyneg.png"),
        }),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicozpos.png"),
        }),
        new THREE.MeshStandardMaterial({
          map: textureLoader.load("./texturas/cerdo/hocicozneg.png"),
        }),
      ];
    var geometriahocico = new THREE.BoxGeometry(4/PM.PIXELES_ESTANDAR, 3/PM.PIXELES_ESTANDAR, 1/PM.PIXELES_ESTANDAR);

    var hocico = new THREE.Mesh(geometriahocico,texturaHocico);

    hocico.position.y=(2.5)/PM.PIXELES_ESTANDAR;
    hocico.position.z=4.5/PM.PIXELES_ESTANDAR;



    const texturaCabeza = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cabezazneg.png"),
      }),
    ];
    
    //CABESA
    var geometriaCabeza = new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR);

    var cabeza = new THREE.Mesh(geometriaCabeza,texturaCabeza);

    cabeza.position.y=4/PM.PIXELES_ESTANDAR;

    this.cabezaW1=new THREE.Object3D();
    this.cabezaW1.add(cabeza);
    this.cabezaW1.add(hocico);

    this.cabezaW1.position.y=(2+6)/PM.PIXELES_ESTANDAR;
    this.cabezaW1.position.z=10/PM.PIXELES_ESTANDAR;

    this.add(this.cabezaW1);

    //BRAZOS Y PIERNAS

    const texturabrazoR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazozneg.png"),
      }),
    ];


    const texturabrazoL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazozposR.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/brazoznegR.png"),
      }),

    ];

    var geometriaExtremidad = new THREE.BoxGeometry(4/PM.PIXELES_ESTANDAR,6/PM.PIXELES_ESTANDAR,4/PM.PIXELES_ESTANDAR);
    var pataLD = new THREE.Mesh(geometriaExtremidad, this.material);

    //brazo izquierdo
    pataLD.position.y = -3/PM.PIXELES_ESTANDAR;
    var pataRD = pataLD.clone();
    this.pataLeftDel = new THREE.Object3D();
    this.pataLeftDel.add(pataLD);
    //this.brazoLeft.rotation.x = 0.3;
    this.pataLeftDel.position.y = 6/PM.PIXELES_ESTANDAR;

    this.pataLeftDelW1 = new THREE.Object3D();
    this.pataLeftDelW1.position.x = (2+1)/PM.PIXELES_ESTANDAR;
    this.pataLeftDelW1.position.z = (2+3)/PM.PIXELES_ESTANDAR;

    this.pataLeftDelW1.add(this.pataLeftDel);

    this.pataRightDel = new THREE.Object3D();
    this.pataRightDel.add(pataRD);
    //this.brazoRight.rotation.x = -0.3;
    this.pataRightDel.position.y = 6/PM.PIXELES_ESTANDAR;

    this.pataRightDelW1 = new THREE.Object3D();
    this.pataRightDelW1.position.x = (-2-1)/PM.PIXELES_ESTANDAR;
    this.pataRightDelW1.position.z = (2+3)/PM.PIXELES_ESTANDAR;
    this.pataRightDelW1.add(this.pataRightDel);


    this.add(this.pataLeftDelW1);
    this.add(this.pataRightDelW1);

    //Piernas

    const texturaPiernaR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernazneg.png"),
      }),
    ];

    const texturaPiernaL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/piernazneg.png"),
      }),
    ];
    //Izquierda
    var pataLT=new THREE.Mesh(geometriaExtremidad, this.textura);
    var pataRT=new THREE.Mesh(geometriaExtremidad, this.textura);

    pataLT.position.y=-3/PM.PIXELES_ESTANDAR;
    pataRT.position.y=-3/PM.PIXELES_ESTANDAR;

    this.pataLeftTras=new THREE.Object3D();
    this.pataRightTras=new THREE.Object3D();

    this.pataLeftTras.add(pataLT);
    this.pataRightTras.add(pataRT);

    this.pataLeftTras.position.set((2+1)/PM.PIXELES_ESTANDAR, 6/PM.PIXELES_ESTANDAR , (-2-3)/PM.PIXELES_ESTANDAR);
    this.pataRightTras.position.set((-2-1)/PM.PIXELES_ESTANDAR, 6/PM.PIXELES_ESTANDAR , (-2-3)/PM.PIXELES_ESTANDAR);
    this.add(this.pataLeftTras);
    this.add(this.pataRightTras);

    const texturaCuerpo = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/cerdo/cuerpozneg.png"),
      }),
    ];
    //TORSO
    var geometriaTorso=new THREE.BoxGeometry(10/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR, 16/PM.PIXELES_ESTANDAR);

    var torso=new THREE.Mesh(geometriaTorso, texturaCuerpo);
    torso.position.y = (4+6)/PM.PIXELES_ESTANDAR;

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

    folder.add (this.guiControls, 'giroY', -Math.PI/2, Math.PI/2, 0.1).name ('Giro cerdo: ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  resetPosicion(){
    this.piernaLW1.rotation.x=0;
    this.piernaRW1.rotation.x=0;
    this.brazoLeft.rotation.x=0;
    this.brazoRight.rotation.x=0;
    this.wrapperFinal.rotation.y=0;
  }

  update (movimiento) {
    let velocidad=this.clock.getDelta()*4.317;
    
    switch(movimiento){
      case "adelante":{
        this.wrapperFinal.rotation.y=0;
        this.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), velocidad);
        //alert(this.cambiarAnimacion)

        //this.resetPosicion();

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad     

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }          
        }

        break;
      }

      case "atras":{
        this.wrapperFinal.rotation.y=0;
        this.translateOnAxis(new THREE.Vector3(0, 0, -1).normalize(), velocidad);

        //this.resetPosicion();

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad     

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }       
        }   
                
        break;
      }

      case "strafeL":{
        if(this.wrapperFinal.rotation.y<this.degToRad(45)){
          this.wrapperFinal.rotation.y+=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), velocidad);

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad     

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }          
        }       
        break;
      }

      case "strafeR":{
        if(this.wrapperFinal.rotation.y>this.degToRad(-45)){
          this.wrapperFinal.rotation.y-=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(-1, 0, 0).normalize(), velocidad);

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad     

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }          
        }             
        break;
      }
      
      case "upLeft":{
        if(this.wrapperFinal.rotation.y<this.degToRad(45)){
          this.wrapperFinal.rotation.y+=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(1, 0, 1).normalize(), velocidad);


        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad     

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }          
        }        
        break;
      }
      
      case "upRight":{
        if(this.wrapperFinal.rotation.y>this.degToRad(-45)){
          this.wrapperFinal.rotation.y-=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(-1, 0, 1).normalize(), velocidad);

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad     

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }          
        }         
        break;
      }
      
      case "downLeft":{
        if(this.wrapperFinal.rotation.y>this.degToRad(-45)){
          this.wrapperFinal.rotation.y-=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(1, 0, -1).normalize(), velocidad);

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=-velocidad
          this.piernaRW1.rotation.x-=-velocidad
          this.brazoLeft.rotation.x-=-velocidad
          this.brazoRight.rotation.x+=-velocidad

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=velocidad
          this.piernaRW1.rotation.x-=velocidad
          this.brazoLeft.rotation.x-=velocidad
          this.brazoRight.rotation.x+=velocidad     

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }       
        }           
        break;
      }
      
      case "downRight":{
        if(this.wrapperFinal.rotation.y<this.degToRad(45)){
          this.wrapperFinal.rotation.y+=0.08;
        }
        this.translateOnAxis(new THREE.Vector3(-1, 0, -1).normalize(), velocidad);

        if(this.cambiarAnimacion){
          this.piernaLW1.rotation.x+=-0.1
          this.piernaRW1.rotation.x-=-0.1
          this.brazoLeft.rotation.x-=-0.1
          this.brazoRight.rotation.x+=-0.1

          if(this.piernaRW1.rotation.x>=this.maxMovimientoExt){
            this.cambiarAnimacion=false;
          }
        }
        else{
          this.piernaLW1.rotation.x+=0.1
          this.piernaRW1.rotation.x-=0.1
          this.brazoLeft.rotation.x-=0.1
          this.brazoRight.rotation.x+=0.1          

          if(this.piernaRW1.rotation.x<=-this.maxMovimientoExt){
            this.cambiarAnimacion=true;
          }       
        }          
        break;
      }    

      case "jump":{
        console.log("acaba con mi sufrimiento");
      }
      
      default:{
        break;
      }
      
    }

    this.target.x=this.position.x;
    this.target.y=this.position.y;
    this.target.z=this.position.z;
    //this.rotation.y=this.guiControls.giroY;


    //console.log(this.clock.getDelta()*this.clock.getDelta())
    //this.position.y-=0.981*this.clock.getDelta()//*this.clock.getDelta()

    //Parte de animacion
    /*
    this.cabezaW1.rotation.y=this.guiControls.cabezaY;
    this.cabezaW1.rotation.x=this.guiControls.cabezaX;

    this.piernaLW1.rotation.x=this.guiControls.piernaL;    //
    this.piernaRW1.rotation.x=this.guiControls.piernaR;
    this.brazoLeft.rotation.x=this.guiControls.brazoL;    //
    this.brazoRight.rotation.x=this.guiControls.brazoR;

    this.rotation.y=this.guiControls.giroY;
    */
  }
}

export { Cerdo };