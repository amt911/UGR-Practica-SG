//import { MeshPhongMaterial } from '../../libs/three.module.js';
import { Cubo } from '../Cubo.js';
import * as THREE from '../../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';

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

export { Roca };