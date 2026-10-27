import { Object3D } from '../Object3D.js';

export class AmbientLight extends Object3D {
  constructor(intensity = 0.15, color = [0.55, 0.65, 0.8]) {
    super();
    this.kind = 'ambient';
    this.intensity = intensity;
    this.color = color;
  }

  get rgb() {
    return [
      this.color[0] * this.intensity,
      this.color[1] * this.intensity,
      this.color[2] * this.intensity,
    ];
  }
}
