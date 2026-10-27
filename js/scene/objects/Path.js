import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { BoxGeometry } from '../../geometry/BoxGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';
import { sceneConfig } from '../../config/sceneConfig.js';
import { Vec3 } from '../../math/Vec3.js';

export class Path extends Object3D {
  constructor(textures, island) {
    super();
    this.name = 'Path';
    const mat = new StandardMaterial(textures['roca.jpg'], { shininess: 8, specular: 0.04 });
    const geo = GeometryFactory.get('path-stone', () => new BoxGeometry(0.72, 0.07, 0.52));
    const { from, to, steps } = sceneConfig.path;

    const baseDir = Vec3.normalize(Vec3.sub(to, from));
    const perp = [-baseDir[2], 0, baseDir[0]];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      // Suave curva natural en S que sube la colina hacia el molino
      const curve = Math.sin(t * Math.PI) * 0.45;
      const x = from[0] + (to[0] - from[0]) * t + perp[0] * curve;
      const z = from[2] + (to[2] - from[2]) * t + perp[2] * curve;
      const y = island ? island.heightAt(x, z) : 0.4;

      const stone = new Mesh(geo, mat);
      stone.position = [x, y + 0.035, z];
      stone.rotation = [0, Math.atan2(baseDir[0], baseDir[2]) + Math.cos(t * Math.PI) * 0.15, 0];
      this.add(stone);
    }
  }
}
