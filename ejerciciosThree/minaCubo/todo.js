import * as THREE from '../libs/three.module.js'
//import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';


class VoxelWorld {
    constructor(options, BORRAR) {
        this.material=options.material;
        this.cellSize = options.cellSize;
        this.tileSize = options.tileSize;
        this.tileTextureWidth = options.tileTextureWidth;
        this.tileTextureHeight = options.tileTextureHeight;
        const {cellSize} = this;
        this.cellSliceSize = cellSize * cellSize;
        this.cells = {};
        
        this.scene=BORRAR;
        this.borrame=[];
        for(let i=0; i<3000; i++){
            this.borrame.push(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial()));
            BORRAR.add(this.borrame[this.borrame.length-1]);
        }
      }

    //Cálculo de las coordenadas del chunk de un voxel concreto (ej: si un chunk es de 16x16, el bloque <32,23,15> estará en el chunq <2,1,0>)
    computeCellId(x, y, z) {
        const {cellSize} = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        return `${cellX},${cellY},${cellZ}`;
      }

    //Cálculo del índice del voxel dentro de su chunk
    computeVoxelOffset(x, y, z) {
        const {cellSize, cellSliceSize} = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
        return voxelY * cellSliceSize +
               voxelZ * cellSize +
               voxelX;
      }

    //Calcula el chunk de un voxel
    getCellForVoxel(x, y, z) {
        return this.cells[this.computeCellId(x, y, z)];
    }

    //Añade un chunk nuevo para un voxel concreto
    addCellForVoxel(x, y, z) {
        console.log("añado chunk");
        const cellId = this.computeCellId(x, y, z);
        let cell = this.cells[cellId];
        if (!cell) {
          const {cellSize} = this;
          cell = new Uint8Array(cellSize * cellSize * cellSize);
          this.cells[cellId] = cell;
        }
        return cell;
      }

    //Añade un voxel en la escena.
    setVoxel(x, y, z, v, addCell = true) {
        let cell = this.getCellForVoxel(x, y, z);
        if (!cell) { //Si el voxel no está incluido en un chunk
          if (!addCell) {
            return;
          }
          cell = this.addCellForVoxel(x, y, z);
        }
        //Calculamos posición del voxel dentro de su chunk y lo agregamos
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
      }

      //Obtiene un voxel a partir de sus coordenadas
    getVoxel(x, y, z) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
          return 0;
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }


      generateGeometryDataForCell(cellX, cellY, cellZ) {
        const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;
    
        for (let y = 0; y < cellSize; ++y) { //altura
          const voxelY = startY + y;
          for (let z = 0; z < cellSize; ++z) { //eje z
            const voxelZ = startZ + z;
            for (let x = 0; x < cellSize; ++x) { //eje x
              const voxelX = startX + x;
              const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
              if (voxel) {
                // voxel 0 is sky (empty) so for UVs we start at 0
                const uvVoxel = voxel - 1;
                // There is a voxel here but do we need faces for it?
                for (const {dir, corners, uvRow} of VoxelWorld.faces) { //Se generan las caras necesarias 
                  const neighbor = this.getVoxel(
                      voxelX + dir[0],
                      voxelY + dir[1],
                      voxelZ + dir[2]);
                  if (!neighbor) {
                    // this voxel has no neighbor in this direction so we need a face.
                    const ndx = positions.length / 3;
                    for (const {pos, uv} of corners) {
                      positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                      normals.push(...dir);
                      uvs.push(
                            (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
                        1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                    }
                    indices.push(
                      ndx, ndx + 1, ndx + 2,
                      ndx + 2, ndx + 1, ndx + 3,
                    );
                  }
                }
              }
            }
          }
        }


        
        //console.log("----------------")
        //console.log(positions);
        //console.log("________________")
        return {
            positions,
            normals,
            uvs,
            indices,
          };
        }    

        generateGeometryDataForCellAllFaces(cellX, cellY, cellZ) {
            const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
            const positions = [];
            const normals = [];
            const uvs = [];
            const indices = [];
            const startX = cellX * cellSize;
            const startY = cellY * cellSize;
            const startZ = cellZ * cellSize;
        
            //console.log(cellSize)
            //let contadorBORRAR=0;
            for (let y = 0; y < cellSize; ++y) { //altura
              const voxelY = startY + y;
              for (let z = 0; z < cellSize; ++z) { //eje z
                const voxelZ = startZ + z;
                for (let x = 0; x < cellSize; ++x) { //eje x
                  const voxelX = startX + x;
                  const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                  if (voxel) {
                    // voxel 0 is sky (empty) so for UVs we start at 0
                    const uvVoxel = voxel - 1;
                    // There is a voxel here but do we need faces for it?
                    for (const {dir, corners, uvRow} of VoxelWorld.faces) { //Se generan las caras necesarias 
                      //const neighbor = this.getVoxel(
                      //    voxelX + dir[0],
                      //    voxelY + dir[1],
                      //    voxelZ + dir[2]);
                        // this voxel has no neighbor in this direction so we need a face.
                        const ndx = positions.length / 3;

                        //console.log("----------------")
                        for (const {pos, uv} of corners) {
                            //console.log((pos[0]+x)+","+(pos[1]+y)+","+(pos[2]+z))
                          positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                          normals.push(...dir);
                          uvs.push(
                                (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
                            1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);

                            //contadorBORRAR++
                        }
                        //console.log("________________")
                        //throw new Error("xd")
                        indices.push(
                          ndx, ndx + 1, ndx + 2,
                          ndx + 2, ndx + 1, ndx + 3,
                        );
                    }
                  }
                }
              }
            }
    
    
            
            //console.log("----------------")
            //console.log(typeof positions)
            //console.log(positions);
            //console.log(new Float32Array(positions))
            //console.log("________________")
            return {
                positions,
                normals,
                uvs,
                indices,
              };
            } 


    //METODOS NUESTROS
    checkCollisionCharacter(p){
        let position=p.position;
        let noc=[this.computeCellId(position.x-1, 0, position.z+1).split(","),
        this.computeCellId(position.x+1, 0, position.z-1).split(","),
        this.computeCellId(position.x+1, 0, position.z+1).split(","),
        this.computeCellId(position.x-1, 0, position.z-1).split(",")]

        for(let i=0; i<noc.length; i++){
            for(let j=0; j<noc[i].length; j++){
                noc[i][j]=parseInt(noc[i]);
            }
        }

        //Ahora hace falta quitar los que son iguales

        let geom=this.generateGeometryDataForCellAllFaces(...noc);

        let cubos=[];

        for(let i=0; i<geom.positions.length/72; i++){
            let bG=new THREE.BoxGeometry(1, 1, 1);
            bG.translate(0.5+geom.positions[i*72], 0.5+geom.positions[i*72+1]-1, 0.5+geom.positions[i*72+2]);

            cubos.push(new THREE.Mesh(bG));     //Hay fuga de memoria aqui

            this.borrame[i].geometry.dispose();
            this.borrame[i].geometry=bG;
        }

        //console.log(cubos.length);
        let esColision=false;
        for(let i=0; i<cubos.length && !esColision; i++){
          if(this.detectarColisionCuboObject(p, cubos[i])){
              esColision=true;
          }
        }

        return esColision;
    }

    detectarColisionCuboObject(p, cubo){
        //console.log(p)
        p.boundingBox.geometry.computeBoundingBox();
        cubo.geometry.computeBoundingBox();
        p.updateMatrixWorld();
        cubo.updateMatrixWorld();

        let a=p.boundingBox.geometry.boundingBox.clone();
        a.applyMatrix4(p.matrixWorld);

        let b=cubo.geometry.boundingBox.clone();
        b.applyMatrix4(cubo.matrixWorld);

        //console.log("-----------------------")
        //console.log(a);
        //console.log(b);
        //console.log("_______________________")

        return a.intersectsBox(b);
    }

    generarChunk(scene) {
        this.cellIdToMesh = {};
        this.neighborOffsets = [
            [0, 0, 0], // self
            [-1, 0, 0], // left
            [1, 0, 0], // right
            [0, -1, 0], // down
            [0, 1, 0], // up
            [0, 0, -1], // back
            [0, 0, 1], // front
        ];

        for (let y = 0; y < this.cellSize; ++y) {
            for (let z = 0; z < this.cellSize; ++z) {
                for (let x = 0; x < this.cellSize; ++x) {
                    /*const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if (y < height) {
                      world.setVoxel(x, y, z, randInt(1, 17));
                    }*/
                    this.setVoxel(x, y, z, randInt(1, 17));
                }
            }
        }

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        this.updateVoxelGeometry(1, 1, 1, scene);  // 0,0,0 will generate 
    }


    updateCellGeometry(x, y, z, scene) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        const cellZ = Math.floor(z / this.cellSize);
        const cellId = this.computeCellId(x, y, z);
        this.mesh = this.cellIdToMesh[cellId];
        this.geometry = this.mesh ? this.mesh.geometry : new THREE.BufferGeometry();

        const { positions, normals, uvs, indices } = this.generateGeometryDataForCell(cellX, cellY, cellZ);
        const positionNumComponents = 3;
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        const normalNumComponents = 3;
        this.geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        const uvNumComponents = 2;
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        this.geometry.setIndex(indices);
        this.geometry.computeBoundingSphere();

        if (!this.mesh) {
            //console.log("prueba")
            //console.log(this.mesh);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.name = cellId;
            this.cellIdToMesh[cellId] = this.mesh;
            scene.add(this.mesh);
            this.mesh.position.set(cellX * this.cellSize, cellY * this.cellSize, cellZ * this.cellSize);
        }

        //console.log(this.cells);
    }


    updateVoxelGeometry(x, y, z, scene) {
        const updatedCellIds = {};
        for (const offset of this.neighborOffsets) {
            const ox = x + offset[0];
            const oy = y + offset[1];
            const oz = z + offset[2];
            const cellId = this.computeCellId(ox, oy, oz);
            if (!updatedCellIds[cellId]) {
                updatedCellIds[cellId] = true;
                this.updateCellGeometry(ox, oy, oz, scene);
            }
        }
    }

    intersectRay(start, end) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dz = end.z - start.z;
        const lenSq = dx * dx + dy * dy + dz * dz;
        const len = Math.sqrt(lenSq);
    
        dx /= len;
        dy /= len;
        dz /= len;
    
        let t = 0.0;
        let ix = Math.floor(start.x);
        let iy = Math.floor(start.y);
        let iz = Math.floor(start.z);
    
        const stepX = (dx > 0) ? 1 : -1;
        const stepY = (dy > 0) ? 1 : -1;
        const stepZ = (dz > 0) ? 1 : -1;
    
        const txDelta = Math.abs(1 / dx);
        const tyDelta = Math.abs(1 / dy);
        const tzDelta = Math.abs(1 / dz);
    
        const xDist = (stepX > 0) ? (ix + 1 - start.x) : (start.x - ix);
        const yDist = (stepY > 0) ? (iy + 1 - start.y) : (start.y - iy);
        const zDist = (stepZ > 0) ? (iz + 1 - start.z) : (start.z - iz);
    
        // location of nearest voxel boundary, in units of t
        let txMax = (txDelta < Infinity) ? txDelta * xDist : Infinity;
        let tyMax = (tyDelta < Infinity) ? tyDelta * yDist : Infinity;
        let tzMax = (tzDelta < Infinity) ? tzDelta * zDist : Infinity;
    
        let steppedIndex = -1;
    
        // main loop along raycast vector
        while (t <= len) {
          const voxel = this.getVoxel(ix, iy, iz);
          if (voxel) {
            return {
              position: [
                start.x + t * dx,
                start.y + t * dy,
                start.z + t * dz,
              ],
              normal: [
                steppedIndex === 0 ? -stepX : 0,
                steppedIndex === 1 ? -stepY : 0,
                steppedIndex === 2 ? -stepZ : 0,
              ],
              voxel,
            };
          }
    
          // advance t to next nearest voxel boundary
          if (txMax < tyMax) {
            if (txMax < tzMax) {
              ix += stepX;
              t = txMax;
              txMax += txDelta;
              steppedIndex = 0;
            } else {
              iz += stepZ;
              t = tzMax;
              tzMax += tzDelta;
              steppedIndex = 2;
            }
          } else {
            if (tyMax < tzMax) {
              iy += stepY;
              t = tyMax;
              tyMax += tyDelta;
              steppedIndex = 1;
            } else {
              iz += stepZ;
              t = tzMax;
              tzMax += tzDelta;
              steppedIndex = 2;
            }
          }
        }
        return null;
      }
    }

    VoxelWorld.faces = [
        { // left
          uvRow: 0,
          dir: [ -1,  0,  0, ],
          corners: [
            { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
          ],
        },
        { // right
          uvRow: 0,
          dir: [  1,  0,  0, ],
          corners: [
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
          ],
        },
        { // bottom
          uvRow: 1,
          dir: [  0, -1,  0, ],
          corners: [
            { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
            { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
          ],
        },
        { // top
          uvRow: 2,
          dir: [  0,  1,  0, ],
          corners: [
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
          ],
        },
        { // back
          uvRow: 0,
          dir: [  0,  0, -1, ],
          corners: [
            { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
          ],
        },
        { // front
          uvRow: 0,
          dir: [  0,  0,  1, ],
          corners: [
            { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
            { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
          ],
        },
      ];
      
export { VoxelWorld }