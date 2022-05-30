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

    this.caidaVel = -0.01;
    this.caidaAcc = -0.01;

    this.clock=new THREE.Clock();
    this.cambiarAnimacion=false;
    this.maxMovimientoExt=this.degToRad(60);
    //this.camara3rdPerson=new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las letiables que se definen para la interfaz
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
    let geometriaCabeza = new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR, 8/PM.PIXELES_ESTANDAR);

    let cabeza = new THREE.Mesh(geometriaCabeza,texturaCabeza);

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

    let geometriaExtremidad = new THREE.BoxGeometry(4/PM.PIXELES_ESTANDAR,12/PM.PIXELES_ESTANDAR,4/PM.PIXELES_ESTANDAR);
    let brazoL = new THREE.Mesh(geometriaExtremidad, texturabrazoL);

    //brazo izquierdo
    brazoL.position.y = -4/PM.PIXELES_ESTANDAR;
    let brazoR = brazoL.clone();
    
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
    let piernaL=new THREE.Mesh(geometriaExtremidad, texturaPiernaL);
    let piernaR=new THREE.Mesh(geometriaExtremidad, texturaPiernaR);

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
    let geometriaTorso=new THREE.BoxGeometry(8/PM.PIXELES_ESTANDAR, 12/PM.PIXELES_ESTANDAR, 4/PM.PIXELES_ESTANDAR);

    let torso=new THREE.Mesh(geometriaTorso, texturaCuerpo);
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

    let boundingBoxGeom = new THREE.BoxGeometry(8 / PM.PIXELES_ESTANDAR, 32 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR);
    this.boundingBox = new THREE.Mesh(boundingBoxGeom, new THREE.MeshPhongMaterial());
    this.boundingBox.position.y += 16 / PM.PIXELES_ESTANDAR

    this.bloqueRaro = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));

    this.position.y+=10;

  }


  createGUI (gui,titleGui) {

    this.guiControls = {
      moviendose: false,

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset: () => {
        this.guiControls.moviendose = false;
      }
    }

    let folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la letiable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'moviendose').name('Movimiento');
  }

  resetPosicion(){

  }
  
  
  animacion(esForward, velocidad){
    //let velocidad = clock.getDelta() * 4.317;
    //console.log(this.radToDeg(this.piernaRW1.rotation.x))
    //console.log(velocidad);
    let velFinal=(esForward)? velocidad : -velocidad;

    if (this.cambiarAnimacion) {
      this.piernaLW1.rotation.x += velFinal
      this.piernaRW1.rotation.x -= velFinal
      // this.brazoLeft.rotation.x -= velFinal
      // this.brazoRight.rotation.x += velFinal

      if ((esForward && this.piernaRW1.rotation.x <= -this.maxMovimientoExt) || (!esForward && this.piernaRW1.rotation.x >= this.maxMovimientoExt)) {
        this.cambiarAnimacion = false;
      }
    }
    else {
      this.piernaLW1.rotation.x += -velFinal
      this.piernaRW1.rotation.x -= -velFinal
      // this.brazoLeft.rotation.x -= -velFinal
      // this.brazoRight.rotation.x += -velFinal

      if ((esForward && this.piernaRW1.rotation.x >= this.maxMovimientoExt) || (!esForward && this.piernaRW1.rotation.x <= -this.maxMovimientoExt)) {
        this.cambiarAnimacion = true;
      }
    }
  }


    //NO FUNCIONA XD
    detectCollisionCharacterWorld(box) {
      this.boundingBox.geometry.computeBoundingBox();
      box.geometry.computeBoundingBox();
      this.boundingBox.updateMatrixWorld();
      box.updateMatrixWorld();
  
      let a = this.boundingBox.geometry.boundingBox.clone();
      a.applyMatrix4(this.boundingBox.matrixWorld);
  
      let b = box.geometry.boundingBox.clone();
      b.applyMatrix4(box.matrixWorld);
  
      return a.intersectsBox(b);
    }

    

    checkCollision(bloques, vector, velocidad, bloqueRaro){
      for(let i=0; i<bloques.length; i++){
        for (let j = 0; j < bloques[i].length; j++) {
          let bV = new THREE.Vector2(bloques[i][j].x, bloques[i][j].z);
          let eV = new THREE.Vector2(this.position.x, this.position.z);
  
          if (bV.distanceTo(eV) <= 0.8 && Math.abs((this.position.x) - (bloques[i][j].x)) >= 0 && Math.abs((this.position.z) - (bloques[i][j].z)) >= 0) {
            //if (this.position.y - (bloques[i][j].y - 0.5)== 0 || this.position.y - (bloques[i][j].y - 0.5)== -1){
              //console.log("asdkjsdlkdjlsdkjf")
              //console.log(Math.abs(this.position.y - bloques[i][j].y))
              bloqueRaro.position.set(bloques[i][j].x, bloques[i][j].y, bloques[i][j].z);
            if(this.detectCollisionCharacterWorld(bloqueRaro) && Math.abs(this.boundingBox.position.y - bloques[i][j].y) <= 0.5){
              let choqueX=this.boundingBox.position.x - bloques[i][j].x;
              let choqueZ=this.boundingBox.position.z - bloques[i][j].z;
  
              //console.log(Math.abs(choqueX)>Math.abs(choqueZ))
              //console.log((choqueZ))
              //console.log((choqueX))
              if(Math.abs(choqueX)>Math.abs(choqueZ)){
                //let valor=0.5;    //Salto automatico
                //let valor=0.8
                //let valor=Math.cos(this.boundingBox.rotation.y%(Math.PI/4))*0.8;
                //console.log(Math.cos(this.boundingBox.rotation.y%(Math.PI/4))*0.8)
                if(choqueX<0.8 && choqueX>0){
                  //this.position.x = bloques[i][j].x + 0.8;
                  //this.boundingBox.position.x = bloques[i][j].x + 0.8;
                  //valor=0.8;
                  //console.log(choqueX);
                  //console.log("entra x");
                }
                else if(choqueX>-0.8){
                  //valor=-0.8;
                  valor=-valor;
                  //valor=Math.cos(this.boundingBox.rotation.y%(Math.PI))*0.8;
                }
                this.position.x = bloques[i][j].x + valor;
                this.boundingBox.position.x = bloques[i][j].x + valor;
              }
              else{
                let valor=Math.cos(this.boundingBox.rotation.y%(Math.PI/4))*0.8;
                //let valor=Math.cos(this.boundingBox.rotation.y%(Math.PI/4))*0.8;
                if(choqueZ<0.8 && choqueZ>0){
                  this.position.z = bloques[i][j].z + valor//0.8;
                  this.boundingBox.position.z = bloques[i][j].z + valor//0.8;
                  //console.log(choqueX);
                }
                else if(choqueZ>-0.8){
                  this.position.z = bloques[i][j].z - valor//0.8;
                  this.boundingBox.position.z = bloques[i][j].z - valor//0.8;
                  //console.log(choqueX);
                }
              }
  
              let aux=new THREE.Vector3(-vector.x, -vector.y, -vector.z)
              this.translateOnAxis(aux.normalize(), velocidad);
              
              this.boundingBox.translateOnAxis(aux, velocidad);
  
              //break;
            }
          }
        }    
      }
    }
  


    update(movimiento, bloques, bloqueRaro){
          this.animacion(true, 0.1);
    //Nuevo vector de 3
    let velocidad;
    velocidad = this.clock.getDelta() * 4.317;
    if(this.guiControls.moviendose){

    let vectorMovimiento = new THREE.Vector3(0, 0, 1);
    //vectormovimiento es el vector entre el modelo y el zombie
    this.translateOnAxis(vectorMovimiento.normalize(), velocidad);

    this.boundingBox.translateOnAxis(vectorMovimiento, velocidad);
    //this.checkCollision(bloques, vectorMovimiento, velocidad, bloqueRaro);
  }

/*
    if(this.puedeSaltar){
      this.caidaVel = 0.15;
      this.puedeSaltar=false;
    }
*/
    //Deteccion de caidas
    this.position.y += this.caidaVel;
    this.boundingBox.position.y+=this.caidaVel;
    this.caidaVel += this.caidaAcc;

    
    for(let i=0; i<bloques.length; i++){
      for (let j = 0; j < bloques[i].length;j++) {
        let bV = new THREE.Vector2(bloques[i][j].x, bloques[i][j].z);
        let eV = new THREE.Vector2(this.position.x, this.position.z);

        if (bV.distanceTo(eV) <= 0.8 && Math.abs((this.position.x) - (bloques[i][j].x)) >= 0 && Math.abs((this.position.z) - (bloques[i][j].z)) >= 0) {
          bloqueRaro.position.set(bloques[i][j].x, bloques[i][j].y, bloques[i][j].z);
          //if (this.position.y - (bloques[i][j].y + 0.5)<= 0 && this.position.y - (bloques[i][j].y + 0.5) > -0.4) {
          if(this.detectCollisionCharacterWorld(bloqueRaro)){
            //console.log("true suelo")
            this.position.y = bloques[i][j].y + 32 / PM.PIXELES_ESTANDAR / 2 - 0.5;
            this.boundingBox.position.y = this.position.y+16/PM.PIXELES_ESTANDAR;

            this.caidaVel = 0;
            this.puedeSaltar=true;

            break;
          }
        }
      }
    }
  }
}

export { Zombie };
