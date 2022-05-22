import { MeshPhongMaterial } from '../../libs/three.module.js';
import { Cubo } from '../Cubo.js';
import * as THREE from '../../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import * as SceneUtils from '../../libs/SceneUtils.js'
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

export { HojaRoble };
