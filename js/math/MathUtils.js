/**
 * Utilidades matemáticas para vectores, escalares e interpolación del Mini Motor Gráfico.
 */
export class MathUtils {
  static clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  static lerpVec3(a, b, t) {
    return [
      MathUtils.lerp(a[0], b[0], t),
      MathUtils.lerp(a[1], b[1], t),
      MathUtils.lerp(a[2], b[2], t),
    ];
  }

  static degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  static radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  static saturate(t) {
    return MathUtils.clamp(t, 0, 1);
  }

  static smoothstep(edge0, edge1, x) {
    const t = MathUtils.saturate((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  static hash(n) {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  }
}
