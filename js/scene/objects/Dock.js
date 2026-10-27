import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { BoxGeometry } from '../../geometry/BoxGeometry.js';
import { CylinderGeometry } from '../../geometry/CylinderGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';
import { sceneConfig } from '../../config/sceneConfig.js';

export class Dock extends Object3D {
  constructor(textures) {
    super();
    this.name = 'Dock';
    const wood = new StandardMaterial(textures['madera.jpg'], { shininess: 8, specular: 0.05 });
    const cfg = sceneConfig.dock;

    const plankGeo = GeometryFactory.get('dock-plank', () => new BoxGeometry(cfg.width, 0.12, 0.55));
    const count = Math.ceil(cfg.length / 0.58);
    for (let i = 0; i < count; i++) {
      const plank = new Mesh(plankGeo, wood);
      plank.position = [0, 0.28, (i - (count - 1) / 2) * 0.58];
      this.add(plank);
    }

    const postGeo = GeometryFactory.get('dock-post', () => new CylinderGeometry(0.08, 0.09, 1.4, 8));
    const halfW = cfg.width * 0.42;
    const halfL = cfg.length * 0.42;
    const posts = [
      [-halfW, -0.4, -halfL],
      [halfW, -0.4, -halfL],
      [-halfW, -0.4, 0],
      [halfW, -0.4, 0],
      [-halfW, -0.4, halfL],
      [halfW, -0.4, halfL],
    ];
    for (const p of posts) {
      const post = new Mesh(postGeo, wood);
      post.position = p;
      this.add(post);
    }

    // Bolardos de amarre
    const bollardGeo = GeometryFactory.get('dock-bollard', () => new CylinderGeometry(0.06, 0.07, 0.35, 8));
    const b1 = new Mesh(bollardGeo, wood);
    b1.position = [halfW * 0.88, 0.46, halfL * 0.65];
    const b2 = new Mesh(bollardGeo, wood);
    b2.position = [halfW * 0.88, 0.46, -halfL * 0.1];
    this.add(b1, b2);

    this.position = [...cfg.position];
    this.rotation = [0, Math.atan2(cfg.position[0], cfg.position[2]), 0];
  }
}
