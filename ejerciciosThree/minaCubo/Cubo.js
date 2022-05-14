import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'
import * as SceneUtils from '../../libs/SceneUtils.js'


class Cubo extends THREE.Object3D {
    constructor() {
      super();
      this.geometria = new THREE.BoxGeometry(16/PM.PIXELES_ESTANDAR,16/PM.PIXELES_ESTANDAR, 16/PM.PIXELES_ESTANDAR);
      this.material = new THREE.MeshPhongMaterial({color: 0xCF0000});
  }

  createGUI (gui,titleGui) {

  }

  update (movimiento) {

  }
}

class Hierba extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/ladocubo.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/ladocubo.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/top.png"), color: 0xa2ff6e}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/bottom.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/ladocubo.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hierba/ladocubo.png")}),
    ];

    this.material = textura;
   // this.caja.material = textura;
   

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}

class Tierra extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/tierra/tierra.png")}),
    ];
    
    this.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}


class MaderaRoble extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderaroblelado.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderaroblelado.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderarobletop.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderarobletop.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderaroblelado.png")}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/maderaroble/maderaroblelado.png")}),
    ];
    
    this.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}




class HojaRoble extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

      var matExt = new THREE.MeshPhongMaterial({alphaMap: loader.load("./texturas/hojaroble/hoja.png"), color: 0x009d0c});
   //   matExt.alphaMap = loader.load("./texturas/hojaroble/hoja.png");
  //  matExt.color = 0xa2ff6e;
    matExt.transparent = true;
    matExt.side = THREE.FrontSide;

    var matInt = matExt.clone();
    matInt.side = THREE.BackSide;
   // matInt.color =  0xa2ff6e;

    
    this.figura = SceneUtils.createMultiMaterialObject(this.geometria,  [matInt, matExt]);
    this.add(this.figura);
  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}

class Piedra extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/piedra/piedra.png")}),
    ];
 
    this.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}



class Roca extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/roca/roca.png")}),
    ];
 
    this.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}

class PiedraBase extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/bedrock.png")}),
    ];
 
    this.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}


class Cristal extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

      var matExt = new THREE.MeshPhongMaterial({alphaMap: loader.load("./texturas/cristal.png")});
   //   matExt.alphaMap = loader.load("./texturas/hojaroble/hoja.png");
  //  matExt.color = 0xa2ff6e;
    matExt.transparent = true;
    matExt.side = THREE.FrontSide;

    var matInt = matExt.clone();
    matInt.side = THREE.BackSide;
   // matInt.color =  0xa2ff6e;

    
    this.figura = SceneUtils.createMultiMaterialObject(this.geometria,  [matInt, matExt]);
    this.add(this.figura);
  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}

export {Hierba, Tierra, Roca, Piedra, HojaRoble, MaderaRoble, PiedraBase, Cristal};
