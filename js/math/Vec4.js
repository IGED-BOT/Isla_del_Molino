export class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  static fromArray(a) {
    return new Vec4(a[0], a[1], a[2], a[3] ?? 1);
  }

  static scale(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s, v[3] * s];
  }
}
