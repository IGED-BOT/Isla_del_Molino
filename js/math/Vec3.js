export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  static fromArray(a) {
    return new Vec3(a[0], a[1], a[2]);
  }

  static add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  static sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  static scale(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
  }

  static negate(v) {
    return [-v[0], -v[1], -v[2]];
  }

  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  static cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  static length(v) {
    return Math.hypot(v[0], v[1], v[2]);
  }

  static normalize(v) {
    const l = Vec3.length(v);
    if (l < 1e-8) return [0, 0, 0];
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  static lerp(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }

  static copy(v) {
    return [v[0], v[1], v[2]];
  }
}
