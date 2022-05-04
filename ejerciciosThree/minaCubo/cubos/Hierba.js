import * as THREE from '.../libs/three.module.js'
import * as PM from '../ParametrosMundo.js'
class Hierba extends THREE.Object3D{
    constructor() {
      super();

     this.cubo = new THREE.BoxGeometry(16/PM.PIXELES_ESTANDAR);

  }

  createGUI (gui,titleGui) {

  }

  update (movimiento) {

  }
}

export { Hierba };
