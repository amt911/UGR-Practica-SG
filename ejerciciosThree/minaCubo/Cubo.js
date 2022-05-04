import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'
class Cubo extends THREE.Object3D {
    constructor() {
        if (this.constructor == Cubo) {
          throw new Error("Clase Abstracta no se puede instanciar.");
        }
  }

  createGUI (gui,titleGui) {

  }

  update (movimiento) {

  }
}

export { Cubo };
