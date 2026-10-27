import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { PlaneGeometry } from '../../geometry/PlaneGeometry.js';
import { FoliageMaterial } from '../materials/FoliageMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';

export class GrassTuft extends Object3D {
  constructor(textures, { position = [0, 0, 0], scale = 1, yaw = 0 } = {}) {
    super();
    this.name = 'GrassTuft';

    const mat = new FoliageMaterial(textures['palmera_hoja.png'], [0.24, 0.55, 0.18]);
    const geo = GeometryFactory.get('grass-plane', () => new PlaneGeometry(0.75, 0.55, 1, 3, 1));

    // Dos planos verticales cruzados en X
    const p1 = new Mesh(geo, mat);
    p1.rotation = [Math.PI / 2, 0, 0];
    p1.position = [0, 0.25, 0];

    const p2 = new Mesh(geo, mat);
    p2.rotation = [Math.PI / 2, Math.PI / 2, 0];
    p2.position = [0, 0.25, 0];

    this.add(p1, p2);
    this.position = [...position];
    this.rotation = [0, yaw, 0];
    this.scale = [scale, scale, scale];
  }
}
