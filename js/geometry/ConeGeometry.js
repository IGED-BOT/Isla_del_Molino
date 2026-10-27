import { CylinderGeometry } from './CylinderGeometry.js';

export class ConeGeometry extends CylinderGeometry {
  constructor(radius = 1, height = 1, radial = 20) {
    super(0.001, radius, height, radial, 1, true);
    this.radius = radius;
    this.coneHeight = height;
    this.coneRadial = radial;
  }
}
