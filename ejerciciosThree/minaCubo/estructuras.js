import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import * as PM from './ParametrosMundo.js'
import * as cubos from './Cubo.js'

class ArbolRoble extends THREE.Object3D {
constructor(){
    super();
    var matrix = new THREE.Matrix4();
    var altura = Math.random() + 4;

    var f = 0;
    var madera = new cubos.MaderaRoble();
    var altura = Math.floor(Math.random()*2) + 4;
    console.log(altura);

    this.meshmadera = new THREE.InstancedMesh(madera.geometria, madera.material, altura);
    for (var i = 0; i < altura; i++) {
      matrix.setPosition(3 * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR + i * 16 / PM.PIXELES_ESTANDAR, 5 * 16 / PM.PIXELES_ESTANDAR);
      this.meshmadera.setMatrixAt(f, matrix);
      f++;
    }
    this.add(this.meshmadera);

    f = 0;
    var hoja = new cubos.HojaRoble();
    this.array=[];
    //let meshhojas = new THREE.InstancedMesh(hoja.geometria, hoja.material, 35);
    for (var i = 2; i < 5; i++) {
      for (var j = 4; j < 7; j++) {
        for (var k = 2; k < altura+1; k++) {
          if (i != 3 || j != 5 || k > altura-1) {
            var h = hoja.clone();
            h.position.set(i * 16 / PM.PIXELES_ESTANDAR, 8 / PM.PIXELES_ESTANDAR + k * 16 / PM.PIXELES_ESTANDAR, j * 16 / PM.PIXELES_ESTANDAR);
            this.array.push(h);
            this.add(h);

          }
        }
      }
    }
}

    
}


export {ArbolRoble};