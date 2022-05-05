import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'
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

export { Cubo };
