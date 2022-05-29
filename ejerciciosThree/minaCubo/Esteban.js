import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'


//IMPORTANTE: LA CAMARA SE CENTRA EN LA CABEZA Y PIVOTA ALREDEDOR DE LA MISMA
class Esteban extends THREE.Object3D {
  degToRad(deg) {
    return deg * (Math.PI / 180)
  }

  radToDeg(rad) {
    return rad * (180 / Math.PI);
  }
  constructor(gui, titleGui) {
    super();

    this.caidaVel = -0.01;
    this.caidaAcc = -0.01;

    this.clock = new THREE.Clock();
    this.clockAnim=new THREE.Clock();
    this.cambiarAnimacion = false;
    this.maxMovimientoExt = this.degToRad(60);

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las letiables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    const textureLoader = new THREE.TextureLoader();
    const texturaCabeza = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cabezazneg.png"),
      }),
    ];

    //CABEZA
    let geometriaCabeza = new THREE.BoxGeometry(8 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR);

    let cabeza = new THREE.Mesh(geometriaCabeza, texturaCabeza);

    cabeza.position.y = 4 / PM.PIXELES_ESTANDAR;

    this.cabezaW1 = new THREE.Object3D();
    this.cabezaW1.add(cabeza);

    this.cabezaW1.position.y = 24 / PM.PIXELES_ESTANDAR;

    //this.add(this.cabezaW1);

    //BRAZOS Y PIERNAS

    const texturabrazoR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazozneg.png"),
      }),
    ];


    const texturabrazoL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazozposR.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/brazoznegR.png"),
      }),

    ];

    let geometriaExtremidad = new THREE.BoxGeometry(4 / PM.PIXELES_ESTANDAR, 12 / PM.PIXELES_ESTANDAR, 4 / PM.PIXELES_ESTANDAR);
    let brazoL = new THREE.Mesh(geometriaExtremidad, texturabrazoL);

    //brazo izquierdo
    brazoL.position.y = -4 / PM.PIXELES_ESTANDAR;
    let brazoR = brazoL.clone();
    brazoR.material = texturabrazoR;
    this.brazoLeft = new THREE.Object3D();
    this.brazoLeft.add(brazoL);
    //this.brazoLeft.rotation.x = 0.3;
    this.brazoLeft.position.y = 22 / PM.PIXELES_ESTANDAR;

    this.brazoLeftW1 = new THREE.Object3D();
    this.brazoLeftW1.position.x = +6 / PM.PIXELES_ESTANDAR;
    this.brazoLeftW1.add(this.brazoLeft);

    this.brazoRight = new THREE.Object3D();
    this.brazoRight.add(brazoR);
    //this.brazoRight.rotation.x = -0.3;
    this.brazoRight.position.y = 22 / PM.PIXELES_ESTANDAR;

    this.brazoRightW1 = new THREE.Object3D();
    this.brazoRightW1.position.x = -6 / PM.PIXELES_ESTANDAR;
    this.brazoRightW1.add(this.brazoRight);


    //this.add(this.brazoLeftW1);
    //this.add(this.brazoRightW1);

    //Piernas

    const texturaPiernaR = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernazneg.png"),
      }),
    ];

    const texturaPiernaL = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernaypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernayneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernazpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/piernazneg.png"),
      }),
    ];
    //Izquierda
    let piernaL = new THREE.Mesh(geometriaExtremidad, texturaPiernaL);
    let piernaR = new THREE.Mesh(geometriaExtremidad, texturaPiernaR);

    piernaL.position.y = -6 / PM.PIXELES_ESTANDAR;
    piernaR.position.y = -6 / PM.PIXELES_ESTANDAR;

    this.piernaLW1 = new THREE.Object3D();
    this.piernaRW1 = new THREE.Object3D();

    this.piernaLW1.add(piernaL);
    this.piernaRW1.add(piernaR);

    this.piernaLW1.position.set(2 / PM.PIXELES_ESTANDAR, 12 / PM.PIXELES_ESTANDAR, 0);
    this.piernaRW1.position.set(-2 / PM.PIXELES_ESTANDAR, 12 / PM.PIXELES_ESTANDAR, 0);

    //this.add(this.piernaLW1);
    //this.add(this.piernaRW1);

    const texturaCuerpo = [
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpoxpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpoxneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpoypos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpoyneg.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpozpos.png"),
      }),
      new THREE.MeshStandardMaterial({
        map: textureLoader.load("./texturas/esteban/cuerpozneg.png"),
      }),
    ];
    //TORSO
    let geometriaTorso = new THREE.BoxGeometry(8 / PM.PIXELES_ESTANDAR, 12 / PM.PIXELES_ESTANDAR, 4 / PM.PIXELES_ESTANDAR);

    let torso = new THREE.Mesh(geometriaTorso, texturaCuerpo);
    torso.position.y = 18 / PM.PIXELES_ESTANDAR;
    //this.add(torso);


    //ESTO ES NECESARIO PARA QUE FUNCIONE LA ANIMACION DE STRAFE
    this.wrapperFinal = new THREE.Object3D();

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

    //this.add(this.boundingBox);

    this.bloqueRaro = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    //this.add(this.bloqueRaro);

    this.position.y += 10;

    this.puedeSaltar=true;

    this.previo={
      fil: -1,
      col: -1,
    };
  }

  addCamara(camara) {
    this.cameraControls = camara;
  }

  createGUI(gui, titleGui) {
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
      reset: () => {
        this.guiControls.cabezaX = 0;
        this.guiControls.cabezaY = 0;
        this.guiControls.piernaL = 0;
        this.guiControls.piernaR = 0;
        this.guiControls.giroY = 0;
        this.guiControls.brazoL = 0;
        this.guiControls.brazoR = 0;
      }
    }

    // Se crea una sección para los controles de la caja
    let folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la letiable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'cabezaY', -Math.PI / 2, Math.PI / 2, 0.1).name('Cabeza Y : ').listen();
    folder.add(this.guiControls, 'cabezaX', -Math.PI / 2, Math.PI / 2, 0.1).name('Cabeza X : ').listen();

    folder.add(this.guiControls, 'piernaL', -Math.PI / 2, Math.PI / 2, 0.1).name('Pierna L : ').listen();
    folder.add(this.guiControls, 'piernaR', -Math.PI / 2, Math.PI / 2, 0.1).name('Pierna R : ').listen();

    folder.add(this.guiControls, 'brazoL', -Math.PI / 2, Math.PI / 2, 0.1).name('Brazo L : ').listen();
    folder.add(this.guiControls, 'brazoR', -Math.PI / 2, Math.PI / 2, 0.1).name('Brazo R : ').listen();

    folder.add(this.guiControls, 'giroY', -Math.PI / 2, Math.PI / 2, 0.1).name('Giro Esteban: ').listen();

    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  resetPosicion() {
    this.piernaLW1.rotation.x = 0;
    this.piernaRW1.rotation.x = 0;
    this.brazoLeft.rotation.x = 0;
    this.brazoRight.rotation.x = 0;
    this.wrapperFinal.rotation.y = 0;
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


  animacion(esForward, velocidad){
    //let velocidad = clock.getDelta() * 4.317;
    //console.log(this.radToDeg(this.piernaRW1.rotation.x))
    //console.log(velocidad);
    let velFinal=(esForward)? velocidad : -velocidad;

    if (this.cambiarAnimacion) {
      this.piernaLW1.rotation.x += velFinal
      this.piernaRW1.rotation.x -= velFinal
      this.brazoLeft.rotation.x -= velFinal
      this.brazoRight.rotation.x += velFinal

      if ((esForward && this.piernaRW1.rotation.x <= -this.maxMovimientoExt) || (!esForward && this.piernaRW1.rotation.x >= this.maxMovimientoExt)) {
        this.cambiarAnimacion = false;
      }
    }
    else {
      this.piernaLW1.rotation.x += -velFinal
      this.piernaRW1.rotation.x -= -velFinal
      this.brazoLeft.rotation.x -= -velFinal
      this.brazoRight.rotation.x += -velFinal

      if ((esForward && this.piernaRW1.rotation.x >= this.maxMovimientoExt) || (!esForward && this.piernaRW1.rotation.x <= -this.maxMovimientoExt)) {
        this.cambiarAnimacion = true;
      }
    }
  }


  checkCollision(bloques, vector, velocidad, bloqueRaro){
    for(let i=0; i<bloques.length; i++){
      for (let j = 0; j < bloques[i].length; j++) {
        let bV = new THREE.Vector2(bloques[i][j].x, bloques[i][j].z);
        let eV = new THREE.Vector2(this.position.x, this.position.z);

        if (bV.distanceTo(eV) <= 0.8 && Math.abs((this.position.x) - (bloques[i][j].x)) >= 0 && Math.abs((this.position.z) - (bloques[i][j].z)) >= 0) {
          if (this.position.y - (bloques[i][j].y - 0.5)== 0 || this.position.y - (bloques[i][j].y - 0.5)== -1){
            //console.log("asdkjsdlkdjlsdkjf")
            //console.log(Math.abs(this.position.y - bloques[i][j].y))
            //bloqueRaro.position.set(bloques[i][j].x, bloques[i][j].y, bloques[i][j].z);
          //if(this.detectCollisionCharacterWorld(bloqueRaro) && this.previo.fil!=i && this.previo.col!=j){
            let aux=new THREE.Vector3(-vector.x, -vector.y, -vector.z)
            this.translateOnAxis(aux.normalize(), velocidad);
            
            this.boundingBox.translateOnAxis(aux, velocidad);

            //break;
          }
        }
      }    
    }
  }

  update(movimiento, bloques, bloqueRaro, teclasPulsadas) {
    let velocidad = this.clock.getDelta() * 4.317;
    this.cabezaW1.rotation.x = Math.PI / 2 - this.cameraControls.getPolarAngle();
    this.rotation.y = - Math.PI + this.cameraControls.getAzimuthalAngle();
    this.boundingBox.rotation.y = - Math.PI + this.cameraControls.getAzimuthalAngle();

    let vectorDir=new THREE.Vector3(0, 0, 0);

    let moviendose=false;
    let esForward=true;
    
    if(teclasPulsadas.W){
      vectorDir.z+=1;
      moviendose = true;
    }
    if(teclasPulsadas.S){
      vectorDir.z-=1;
      moviendose = true;
      esForward=false;
    }
    if(teclasPulsadas.A){
           vectorDir.x+=1;
      moviendose = true;
    }
    if(teclasPulsadas.D){
      vectorDir.x-=1;
      moviendose = true;
    }

    if((teclasPulsadas.A && teclasPulsadas.W) || (teclasPulsadas.D && teclasPulsadas.S)){
      if (this.wrapperFinal.rotation.y < this.degToRad(45)) {
        this.wrapperFinal.rotation.y += 0.08;
      }      
    }
    else if((teclasPulsadas.A && teclasPulsadas.S) || (teclasPulsadas.D && teclasPulsadas.W)){
      if (this.wrapperFinal.rotation.y > this.degToRad(-45)) {
        this.wrapperFinal.rotation.y -= 0.08;
      }            
    }
    else if(teclasPulsadas.A){
      if (this.wrapperFinal.rotation.y < this.degToRad(45)) {
        this.wrapperFinal.rotation.y += 0.08;
      }      
    }
    else if(teclasPulsadas.D){
      if (this.wrapperFinal.rotation.y > this.degToRad(-45)) {
        this.wrapperFinal.rotation.y -= 0.08;
      }
    }
    else if(teclasPulsadas.W){
      this.wrapperFinal.rotation.y = 0;
    }
    else if(teclasPulsadas.S){
      if (this.wrapperFinal.rotation.y < 0) {
        this.wrapperFinal.rotation.y += 0.08;

        if (this.wrapperFinal.rotation.y > 0)
          this.wrapperFinal.rotation.y = 0;
      }
      else if (this.wrapperFinal.rotation.y > 0) {
        this.wrapperFinal.rotation.y -= 0.08;

        if (this.wrapperFinal.rotation.y < 0)
          this.wrapperFinal.rotation.y = 0;
      }
    }

    let velocidadFinal=(teclasPulsadas["SHIFT"])? velocidad*2 : velocidad;
    //console.log("---------------------")
    //console.log(vectorDir);
    this.translateOnAxis(vectorDir.normalize(), velocidadFinal);
    //console.log(vectorDir);
    //console.log("=======================")
    this.boundingBox.translateOnAxis(vectorDir, velocidadFinal);
    this.checkCollision(bloques, vectorDir, velocidad, bloqueRaro);
    
    if(moviendose)
      this.animacion(esForward, velocidadFinal);

    if(this.puedeSaltar && teclasPulsadas[" "]){
      this.caidaVel = 0.15;
      this.puedeSaltar=false;
    }

    //Deteccion de caidas
    this.position.y += this.caidaVel;
    this.boundingBox.position.y+=this.caidaVel;
    this.caidaVel += this.caidaAcc;

    
    for(let i=0; i<bloques.length; i++){
      for (let j = 0; j < bloques[i].length;j++) {
        let bV = new THREE.Vector2(bloques[i][j].x, bloques[i][j].z);
        let eV = new THREE.Vector2(this.position.x, this.position.z);

        if (bV.distanceTo(eV) <= 0.8 && Math.abs((this.position.x) - (bloques[i][j].x)) >= 0 && Math.abs((this.position.z) - (bloques[i][j].z)) >= 0) {
          //bloqueRaro.position.set(bloques[i][j].x, bloques[i][j].y, bloques[i][j].z);
          if (this.position.y - (bloques[i][j].y + 0.5)<= 0 && this.position.y - (bloques[i][j].y + 0.5) > -0.4) {
          //if(this.detectCollisionCharacterWorld(bloqueRaro)){
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

export { Esteban };
