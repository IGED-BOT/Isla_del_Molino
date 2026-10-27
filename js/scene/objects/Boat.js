import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { BoxGeometry } from '../../geometry/BoxGeometry.js';
import { CylinderGeometry } from '../../geometry/CylinderGeometry.js';
import { PlaneGeometry } from '../../geometry/PlaneGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { FoliageMaterial } from '../materials/FoliageMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';
import { Buoyancy } from '../../world/Buoyancy.js';
import { sceneConfig } from '../../config/sceneConfig.js';
import { COLORS } from '../../config/constants.js';

export class Boat extends Object3D {
  constructor(textures) {
    super();
    this.name = 'Boat';
    this.anchor = [...sceneConfig.boat.position];
    this.yaw = sceneConfig.boat.yaw ?? 1.15;

    const wood = new StandardMaterial(textures['madera.jpg'], { shininess: 8, specular: 0.05 });
    const sailTexture = textures['vela.jpg'] || textures['cielo_dia.jpg'];

    // Casco del barco de madera
    const hull = new Mesh(
      GeometryFactory.get('boat-hull', () => new BoxGeometry(1.15, 0.32, 2.3)),
      wood,
    );
    hull.position = [0, 0.05, 0];

    // Borde / regala del barco
    const gunwaleGeo = GeometryFactory.get('boat-gunwale', () => new BoxGeometry(0.1, 0.12, 2.35));
    const leftG = new Mesh(gunwaleGeo, wood);
    leftG.position = [-0.55, 0.22, 0];
    const rightG = new Mesh(gunwaleGeo, wood);
    rightG.position = [0.55, 0.22, 0];

    // Banco transversal interior
    const bench = new Mesh(
      GeometryFactory.get('boat-bench', () => new BoxGeometry(1.05, 0.06, 0.32)),
      wood,
    );
    bench.position = [0, 0.15, -0.2];

    // Mástil vertical
    const mast = new Mesh(
      GeometryFactory.get('boat-mast', () => new CylinderGeometry(0.04, 0.055, 2.0, 8)),
      wood,
    );
    mast.position = [0, 1.05, 0.2];

    // Vela con tela texturizada que ondea suavemente
    const sail = new Mesh(
      GeometryFactory.get('boat-sail', () => new PlaneGeometry(1.15, 1.45, 4, 6, 1)),
      new FoliageMaterial(sailTexture, COLORS.sail),
    );
    sail.rotation = [0, 0, Math.PI / 2];
    sail.position = [0.06, 1.12, 0.2];
    sail.scale = [1, 1, 0.88];

    this.add(hull, leftG, rightG, bench, mast, sail);
    this.position = [...this.anchor];
  }

  update(dt, waves) {
    Buoyancy.apply(this, waves, this.anchor[0], this.anchor[2], dt);
    // Orientación paralela al muelle amarrado a un costado
    this.rotation[1] = this.yaw;
  }
}
