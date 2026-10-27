export class Mat3 {
  static identity() {
    return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }

  static translation(tx, ty) {
    return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
  }

  static rotation(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1]);
  }

  static scale(sx, sy) {
    return new Float32Array([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
  }

  static multiply(a, b) {
    const out = new Float32Array(9);
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += a[k * 3 + row] * b[col * 3 + k];
        }
        out[col * 3 + row] = sum;
      }
    }
    return out;
  }

  static fromMat4(m) {
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10],
    ]);
  }
}
