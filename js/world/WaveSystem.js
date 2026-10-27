import { WAVES } from '../config/constants.js';
import { Vec2 } from '../math/Vec2.js';

export class WaveSystem {
  constructor() {
    this.waves = WAVES.map((w) => ({ ...w, direction: [...w.direction] }));
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  height(x, z, t = this.time) {
    let y = 0;
    for (const wave of this.waves) {
      const dir = Vec2.normalize(wave.direction);
      const k = (Math.PI * 2) / wave.length;
      const speed = Math.sqrt(9.8 / k);
      y += wave.amplitude * Math.sin(k * (dir[0] * x + dir[1] * z) - speed * t);
    }
    return y;
  }

  normal(x, z, t = this.time) {
    const e = 0.12;
    const hL = this.height(x - e, z, t);
    const hR = this.height(x + e, z, t);
    const hD = this.height(x, z - e, t);
    const hU = this.height(x, z + e, t);
    return [
      hL - hR,
      e * 2,
      hD - hU,
    ];
  }
}
