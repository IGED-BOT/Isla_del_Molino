import { WIND } from '../config/constants.js';
import { Vec3 } from '../math/Vec3.js';

export class WindSystem {
  constructor() {
    this.direction = Vec3.normalize([1, 0, 0.35]);
    this.strength = WIND.baseStrength;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    const gust = Math.sin(this.time * 0.7) * 0.5 + Math.sin(this.time * 1.9) * 0.5;
    this.strength = WIND.baseStrength + gust * WIND.gustAmplitude;
    const yaw = Math.sin(this.time * 0.15) * 0.35;
    this.direction = Vec3.normalize([Math.cos(yaw), 0, Math.sin(yaw)]);
  }
}
