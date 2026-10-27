/**
 * Clase base para todas las geometrías procedurales del Mini Motor WebGL2.
 * Encapsula buffers de atributos (posiciones, normales, coordenadas UV e índices),
 * cálculo de normales de caras, cajas envolventes y gestión escalable.
 */

export class Geometry {
  constructor({
    positions = new Float32Array(0),
    normals = new Float32Array(0),
    uvs = new Float32Array(0),
    indices = null,
  } = {}) {
    this.positions = positions instanceof Float32Array ? positions : new Float32Array(positions);
    this.normals = normals instanceof Float32Array ? normals : new Float32Array(normals);
    this.uvs = uvs instanceof Float32Array ? uvs : new Float32Array(uvs);
    this.indices = indices ? (indices instanceof Uint16Array ? indices : new Uint16Array(indices)) : null;

    this.attributes = new Map();
    this.attributes.set('position', this.positions);
    if (this.normals.length > 0) this.attributes.set('normal', this.normals);
    if (this.uvs.length > 0) this.attributes.set('uv', this.uvs);

    this.boundingBox = null;
    this.boundingSphere = null;
  }

  get vertexCount() {
    return this.positions.length / 3;
  }

  get indexCount() {
    return this.indices ? this.indices.length : 0;
  }

  get triangleCount() {
    return this.indices ? this.indices.length / 3 : this.positions.length / 9;
  }

  setAttribute(name, array) {
    const typed = array instanceof Float32Array ? array : new Float32Array(array);
    this.attributes.set(name, typed);
    if (name === 'position') this.positions = typed;
    if (name === 'normal') this.normals = typed;
    if (name === 'uv') this.uvs = typed;
    return this;
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  setIndices(indices) {
    this.indices = indices ? (indices instanceof Uint16Array ? indices : new Uint16Array(indices)) : null;
    return this;
  }

  computeBoundingBox() {
    if (this.positions.length === 0) {
      this.boundingBox = { min: [0, 0, 0], max: [0, 0, 0] };
      return this.boundingBox;
    }

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < this.positions.length; i += 3) {
      const x = this.positions[i];
      const y = this.positions[i + 1];
      const z = this.positions[i + 2];

      if (x < min[0]) min[0] = x;
      if (y < min[1]) min[1] = y;
      if (z < min[2]) min[2] = z;

      if (x > max[0]) max[0] = x;
      if (y > max[1]) max[1] = y;
      if (z > max[2]) max[2] = z;
    }

    this.boundingBox = { min, max };
    return this.boundingBox;
  }

  computeVertexNormals() {
    const p = this.positions;
    const n = new Float32Array(p.length);

    if (this.indices) {
      for (let i = 0; i < this.indices.length; i += 3) {
        const i0 = this.indices[i] * 3;
        const i1 = this.indices[i + 1] * 3;
        const i2 = this.indices[i + 2] * 3;

        const vAx = p[i1] - p[i0];
        const vAy = p[i1 + 1] - p[i0 + 1];
        const vAz = p[i1 + 2] - p[i0 + 2];

        const vBx = p[i2] - p[i0];
        const vBy = p[i2 + 1] - p[i0 + 1];
        const vBz = p[i2 + 2] - p[i0 + 2];

        const nx = vAy * vBz - vAz * vBy;
        const ny = vAz * vBx - vAx * vBz;
        const nz = vAx * vBy - vAy * vBx;

        n[i0] += nx; n[i0 + 1] += ny; n[i0 + 2] += nz;
        n[i1] += nx; n[i1 + 1] += ny; n[i1 + 2] += nz;
        n[i2] += nx; n[i2 + 1] += ny; n[i2 + 2] += nz;
      }
    } else {
      for (let i = 0; i < p.length; i += 9) {
        const vAx = p[i + 3] - p[i];
        const vAy = p[i + 4] - p[i + 1];
        const vAz = p[i + 5] - p[i + 2];

        const vBx = p[i + 6] - p[i];
        const vBy = p[i + 7] - p[i + 1];
        const vBz = p[i + 8] - p[i + 2];

        const nx = vAy * vBz - vAz * vBy;
        const ny = vAz * vBx - vAx * vBz;
        const nz = vAx * vBy - vAy * vBx;

        n[i] = nx; n[i + 1] = ny; n[i + 2] = nz;
        n[i + 3] = nx; n[i + 4] = ny; n[i + 5] = nz;
        n[i + 6] = nx; n[i + 7] = ny; n[i + 8] = nz;
      }
    }

    // Normalizar
    for (let i = 0; i < n.length; i += 3) {
      const len = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1;
      n[i] /= len;
      n[i + 1] /= len;
      n[i + 2] /= len;
    }

    this.normals = n;
    this.attributes.set('normal', n);
    return this;
  }

  clone() {
    return new Geometry({
      positions: new Float32Array(this.positions),
      normals: new Float32Array(this.normals),
      uvs: new Float32Array(this.uvs),
      indices: this.indices ? new Uint16Array(this.indices) : null,
    });
  }
}
