import { Object3D } from '../Object3D.js';

export class PointLight extends Object3D {
  constructor(color = [1, 1, 1], intensity = 1) {
    super();
    this.kind = 'point';
    this.color = color;
    this.intensity = intensity;
  }
}
