import { log } from '../utils/logger.js';

/**
 * Gestor del Contexto WebGL2 del Mini Motor Gráfico.
 * Inicializa el contexto con capacidades 3D (Depth test, Culling, Viewport, DPR)
 * y provee métodos de gestión y redimensionamiento reactivo.
 */

export class GLContext {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      antialias: true,
      depth: true,
      alpha: false,
      powerPreference: 'high-performance',
      ...options,
    };

    const gl = canvas.getContext('webgl2', this.options);
    if (!gl) {
      throw new Error('WebGL2 no está disponible en este navegador o dispositivo.');
    }
    this.gl = gl;

    this._setupDefaults();
    this.resize();

    log.info('WebGL2 Contexto inicializado:', gl.getParameter(gl.VERSION));
  }

  _setupDefaults() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.05, 0.08, 0.14, 1.0);
  }

  resize() {
    const changed = GLContext.resize(this.canvas);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    return changed;
  }

  static resize(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  static create(canvas, options) {
    return new GLContext(canvas, options);
  }
}
