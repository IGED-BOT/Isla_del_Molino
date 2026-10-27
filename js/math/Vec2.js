export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toArray() {
    return [this.x, this.y];
  }

  static fromArray(a) {
    return new Vec2(a[0], a[1]);
  }

  static add(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  }

  static sub(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  }

  static scale(v, s) {
    return [v[0] * s, v[1] * s];
  }

  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  static length(v) {
    return Math.hypot(v[0], v[1]);
  }

  static normalize(v) {
    const l = Vec2.length(v) || 1;
    return [v[0] / l, v[1] / l];
  }
}
