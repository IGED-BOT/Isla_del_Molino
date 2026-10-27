import { Mesh } from '../Mesh.js';
import { PlaneGeometry } from '../../geometry/PlaneGeometry.js';
import { WaterMaterial } from '../materials/WaterMaterial.js';
import { sceneConfig } from '../../config/sceneConfig.js';

export class Sea extends Mesh {
  constructor(waves) {
    const { size, segments } = sceneConfig.sea;
    super(new PlaneGeometry(size, size, segments, segments), new WaterMaterial());
    this.name = 'Sea';
    this.waves = waves;
    this.position = [0, 0.02, 0];
  }
}
