import { MeshPhongMaterial } from '../../libs/three.module.js';
import { Cubo } from '../Cubo.js';
import * as THREE from '../../libs/three.module.js'

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
 
    this.caja.material = textura;

  }

  createGUI(gui, titleGui) {

  }

  update(movimiento) {

  }
}

export { Hierba };
