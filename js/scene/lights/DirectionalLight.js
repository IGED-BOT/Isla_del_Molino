import { Object3D } from '../Object3D.js';

export class DirectionalLight extends Object3D {
  constructor(color = [1.0, 0.94, 0.82], intensity = 1.0) {
    super();
    this.kind = 'directional';
    this.color = color;
    this.intensity = intensity;
    this.direction = [0.35, -1.0, 0.25];
  }
}
