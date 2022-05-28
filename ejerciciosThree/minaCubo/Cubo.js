import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import * as PM from './ParametrosMundo.js'


class Cubo extends THREE.Object3D {
    constructor() {
      super();
      this.geometria = new THREE.BoxGeometry(16/PM.PIXELES_ESTANDAR,16/PM.PIXELES_ESTANDAR, 16/PM.PIXELES_ESTANDAR);
      this.material = new THREE.MeshPhongMaterial({color: 0xCF0000});
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

}




class HojaRoble extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/hojaroble/hoja.png"), transparent: true, color: 0x345345}),
      
  ];
  this.material = textura; 
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
}

class PiedraLuminosa extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
        new THREE.MeshBasicMaterial({map: loader.load("./texturas/glowstone.png")}),
    ];
 
    this.material = textura;

  }
}


class Cristal extends Cubo {
  constructor() {
    super();
    const loader = new THREE.TextureLoader();

    const textura = [
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
      new THREE.MeshBasicMaterial({map: loader.load("./texturas/cristal.png"), transparent: true}),
  ]; 

  this.material = textura;
  }

}

export {Hierba, Tierra, Roca, Piedra, HojaRoble, MaderaRoble, PiedraBase, Cristal, PiedraLuminosa};
