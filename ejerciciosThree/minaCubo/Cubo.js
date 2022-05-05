import * as THREE from '../libs/three.module.js'
import * as PM from './ParametrosMundo.js'
class Cubo extends THREE.Object3D {
    constructor() {
      super();
      var geometriacubo = new THREE.BoxGeometry(16/PM.PIXELES_ESTANDAR,16/PM.PIXELES_ESTANDAR, 16/PM.PIXELES_ESTANDAR);
      var materialcubo = new THREE.MeshPhongMaterial({color: 0xCF0000});

      this.caja = new THREE.Mesh(geometriacubo, materialcubo);
      this.add(this.caja);
  }

  createGUI (gui,titleGui) {

  }

  update (movimiento) {

  }
}

export { Cubo };
