import { Vec3 } from '../math/Vec3.js';

export class Buoyancy {
  static apply(object, waves, x, z, dt) {
    const y = waves.height(x, z);
    const n = waves.normal(x, z);
    const up = Vec3.normalize(n);
    object.position[0] = x;
    object.position[1] = y + 0.18;
    object.position[2] = z;
    object.rotation[2] = object.rotation[2] * (1 - dt * 2) + Math.atan2(up[0], up[1]) * dt * 2;
    object.rotation[0] = object.rotation[0] * (1 - dt * 2) + Math.atan2(-up[2], up[1]) * dt * 2;
  }
}
