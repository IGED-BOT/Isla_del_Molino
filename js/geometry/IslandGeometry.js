import { Geometry } from '../core/Geometry.js';

/**
 * Geometría procedural orgánica para la Isla del Molino.
 * Genera una costa natural con bahías, promontorios y elevaciones suaves,
 * sellada herméticamente en la base con falda y tapa inferior a nivel del lecho marino.
 */

export class IslandGeometry extends Geometry {
  constructor(baseRadius = 9.2, flatten = 0.42, rings = 28, sectors = 56) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // Vértice central en el pico de la isla
    const h0 = IslandGeometry.getHeight(0, 0, baseRadius, flatten);
    const n0 = IslandGeometry.getNormal(0, 0, baseRadius, flatten);
    positions.push(0, h0, 0);
    normals.push(n0[0], n0[1], n0[2]);
    uvs.push(0.5, 0.5);

    const cols = sectors + 1;

    // Anillos concéntricos de terreno
    for (let i = 1; i <= rings; i++) {
      const frac = i / rings;
      for (let j = 0; j <= sectors; j++) {
        const theta = (j / sectors) * Math.PI * 2;
        const rCoast = IslandGeometry.getCoastRadius(theta, baseRadius);
        const r = frac * rCoast;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = IslandGeometry.getHeight(x, z, baseRadius, flatten);
        const norm = IslandGeometry.getNormal(x, z, baseRadius, flatten);
        positions.push(x, y, z);
        normals.push(norm[0], norm[1], norm[2]);
        uvs.push(x / (baseRadius * 2.4) + 0.5, z / (baseRadius * 2.4) + 0.5);
      }
    }

    // Triángulos del anillo 1 (conectados al vértice central 0)
    for (let j = 0; j < sectors; j++) {
      indices.push(0, 1 + j + 1, 1 + j);
    }

    // Cuadriláteros de los anillos intermedios
    for (let i = 1; i < rings; i++) {
      const rowA = 1 + (i - 1) * cols;
      const rowB = 1 + i * cols;
      for (let j = 0; j < sectors; j++) {
        const a0 = rowA + j;
        const a1 = rowA + j + 1;
        const b0 = rowB + j;
        const b1 = rowB + j + 1;
        indices.push(a0, a1, b0);
        indices.push(b0, a1, b1);
      }
    }

    // Falda submarina (skirt) para sumergir suavemente el borde bajo el agua
    const skirtStart = positions.length / 3;
    const skirtY = -0.38;
    for (let j = 0; j <= sectors; j++) {
      const theta = (j / sectors) * Math.PI * 2;
      const rCoast = IslandGeometry.getCoastRadius(theta, baseRadius) * 1.025;
      const x = rCoast * Math.cos(theta);
      const z = rCoast * Math.sin(theta);
      positions.push(x, skirtY, z);
      normals.push(Math.cos(theta), -0.2, Math.sin(theta));
      uvs.push(x / (baseRadius * 2.4) + 0.5, z / (baseRadius * 2.4) + 0.5);
    }

    const outerRow = 1 + (rings - 1) * cols;
    for (let j = 0; j < sectors; j++) {
      const a0 = outerRow + j;
      const a1 = outerRow + j + 1;
      const b0 = skirtStart + j;
      const b1 = skirtStart + j + 1;
      indices.push(a0, a1, b0);
      indices.push(b0, a1, b1);
    }

    // Tapa inferior a skirtY con normal hacia abajo [0, -1, 0]
    const bottomCenter = positions.length / 3;
    positions.push(0, skirtY, 0);
    normals.push(0, -1, 0);
    uvs.push(0.5, 0.5);

    for (let j = 0; j < sectors; j++) {
      indices.push(bottomCenter, skirtStart + j, skirtStart + j + 1);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.baseRadius = baseRadius;
    this.flatten = flatten;
    this.rings = rings;
    this.sectors = sectors;
  }

  static getCoastRadius(theta, baseRadius = 9.2) {
    const variation =
      0.13 * Math.cos(theta - 0.5) +
      0.11 * Math.cos(2 * theta - 1.2) -
      0.08 * Math.sin(3 * theta + 0.4) +
      0.05 * Math.cos(5 * theta - 0.7);
    return baseRadius * (1.0 + variation);
  }

  static getHeight(x, z, baseRadius = 9.2, flatten = 0.42) {
    const theta = Math.atan2(z, x);
    const rCoast = IslandGeometry.getCoastRadius(theta, baseRadius);
    const dist = Math.hypot(x, z);
    if (dist >= rCoast) return 0;

    const u = dist / rCoast;
    const baseHill = Math.pow(Math.max(0, 1.0 - u * u), 1.25) * (baseRadius * flatten);
    const dMill2 = (x + 1.2) ** 2 + (z + 1.6) ** 2;
    const millHill = 0.48 * Math.exp(-dMill2 / 12.0);
    const ridge = 0.22 * Math.sin(x * 0.45 + 0.5) * Math.cos(z * 0.5 - 0.3) * (1.0 - u);
    const coastTaper = Math.min(1.0, (1.0 - u) * 4.5);

    return Math.max(0, (baseHill + millHill + ridge) * coastTaper);
  }

  static getNormal(x, z, baseRadius = 9.2, flatten = 0.42) {
    const eps = 0.08;
    const hL = IslandGeometry.getHeight(x - eps, z, baseRadius, flatten);
    const hR = IslandGeometry.getHeight(x + eps, z, baseRadius, flatten);
    const hD = IslandGeometry.getHeight(x, z - eps, baseRadius, flatten);
    const hU = IslandGeometry.getHeight(x, z + eps, baseRadius, flatten);
    const nx = hL - hR;
    const ny = 2 * eps;
    const nz = hD - hU;
    const len = Math.hypot(nx, ny, nz) || 1;
    return [nx / len, ny / len, nz / len];
  }
}
