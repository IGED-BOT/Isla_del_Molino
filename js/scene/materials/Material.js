import { Program } from '../../core/Program.js';

/**
 * Gestor de caché y compilación de programas de shader (GLSL ES 3.00).
 * Evita recompilar o reenlazar programas duplicados para materiales idénticos.
 */
export class ProgramManager {
  static #cache = new WeakMap();

  static getProgram(gl, key, vert, frag) {
    let map = this.#cache.get(gl);
    if (!map) {
      map = new Map();
      this.#cache.set(gl, map);
    }
    if (!map.has(key)) {
      map.set(key, new Program(gl, vert, frag));
    }
    return map.get(key);
  }

  static hasProgram(gl, key) {
    const map = this.#cache.get(gl);
    return map ? map.has(key) : false;
  }

  static clear(gl) {
    if (gl) this.#cache.delete(gl);
    else this.#cache = new WeakMap();
  }
}

/**
 * Clase base Material del Mini Motor Gráfico.
 * Encapsula shaders, estados de OpenGL (culling, blending, depthMask)
 * y enlace de uniforms comunes y de iluminación.
 */
export class Material {
  constructor({
    renderOrder = 0,
    transparent = false,
    depthWrite = true,
    cull = true,
  } = {}) {
    this.renderOrder = renderOrder;
    this.transparent = transparent;
    this.depthWrite = depthWrite;
    this.cull = cull;
    this.program = null;
  }

  applyState(gl) {
    if (this.cull) gl.enable(gl.CULL_FACE);
    else gl.disable(gl.CULL_FACE);

    gl.depthMask(this.depthWrite);

    if (this.transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else {
      gl.disable(gl.BLEND);
    }
  }

  bindCommon(frame, local) {
    const gl = frame.gl;
    this.applyState(gl);
    this.program.use();
    const p = this.program;
    p.setMat4('uModelMatrix', local.modelMatrix);
    p.setMat4('uViewMatrix', frame.viewMatrix);
    p.setMat4('uProjectionMatrix', frame.projectionMatrix);
    p.setMat3('uNormalMatrix', local.normalMatrix);
    p.setVec3('uCameraPosition', frame.cameraPosition);
    p.setFloat('uTime', frame.time);
  }

  bindLights(frame) {
    const p = this.program;
    const gl = frame.gl;
    const lights = frame.scene?.lights || [];
    let sunDir = [0.35, -1.0, 0.25];
    let sunCol = [1.0, 0.94, 0.82];
    let sunInt = 1.0;
    let ambCol = [0.18, 0.18, 0.22];

    for (const l of lights) {
      if (l.kind === 'directional') {
        sunDir = l.direction;
        sunCol = l.color;
        sunInt = l.intensity;
      } else if (l.kind === 'ambient') {
        ambCol = [l.color[0] * l.intensity, l.color[1] * l.intensity, l.color[2] * l.intensity];
      }
    }

    p.setVec3('uLightDirection', sunDir);
    p.setVec3('uLightColor', sunCol);
    p.setFloat('uLightIntensity', sunInt);
    p.setVec3('uAmbientColor', ambCol);

    if (frame.dayNight) {
      p.setVec3('uSkyColor', frame.dayNight.skyColor);
    }
  }

  bind(frame, local) {
    // Implementado por subclases
  }
}
