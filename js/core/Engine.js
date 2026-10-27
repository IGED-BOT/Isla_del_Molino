import { GLContext } from './GLContext.js';
import { Renderer } from './Renderer.js';
import { Loop } from './Loop.js';
import { Scene } from '../scene/Scene.js';
import { Camera } from '../scene/Camera.js';
import { InputManager } from '../input/InputManager.js';
import { CameraController } from '../input/CameraController.js';
import { TextureLoader } from '../loaders/loadTexture.js';
import { log } from '../utils/logger.js';

/**
 * Clase principal del Mini Motor Gráfico WebGL2 (MiniEngine).
 * Centraliza el contexto gráfico, grafo de escena, cámara, pipeline de renderizado,
 * gestor de entrada, sistemas temporales y ciclo de vida de la aplicación.
 */
export class Engine {
  constructor(canvas, options = {}) {
    this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    if (!this.canvas) {
      throw new Error('Canvas no encontrado para inicializar el Engine.');
    }

    // Contexto gráfico y renderizador
    this.glContext = new GLContext(this.canvas, options.gl);
    this.gl = this.glContext.gl;
    this.renderer = new Renderer(this.gl, this.canvas);

    // Grafo de escena y cámara
    this.scene = options.scene || new Scene();
    this.camera = options.camera || new Camera();

    // Gestores de entrada e interacción
    this.input = new InputManager(this.canvas);
    this.cameraController = new CameraController(this.camera, this.input);

    // Cargador de texturas integrado
    this.textureLoader = new TextureLoader(this.gl);

    // Registro de sistemas dinámicos (world systems)
    this.systems = new Map();

    // Parámetros de entorno y luces
    this.environment = {
      sun: null,
      ambient: null,
      wind: null,
      waves: null,
      dayNight: null,
    };

    // Objeto de aplicación que participa en la actualización
    this._userUpdate = null;

    // Bucle de renderizado y lógica
    this.loop = new Loop(this);

    // Observador de cambio de tamaño de ventana (interfaz DOM EventListener)
    window.addEventListener('resize', this);

    log.info('Mini Motor Gráfico inicializado con éxito.');
  }

  handleEvent(event) {
    if (event.type === 'resize') {
      this.onResize();
    }
  }

  step(dt, t) {
    this.update(dt, t);
    this.render(t);
  }

  addSystem(name, system) {
    this.systems.set(name, system);
    return this;
  }

  getSystem(name) {
    return this.systems.get(name);
  }

  hasSystem(name) {
    return this.systems.has(name);
  }

  removeSystem(name) {
    return this.systems.delete(name);
  }

  add(...nodes) {
    this.scene.add(...nodes);
    return this;
  }

  remove(...nodes) {
    for (const node of nodes) {
      this.scene.remove(node);
    }
    return this;
  }

  onUpdate(target) {
    if (!target || typeof target.update !== 'function') {
      throw new TypeError('El objeto de actualización debe implementar update(dt, t).');
    }
    this._userUpdate = target;
    return this;
  }

  start() {
    this.loop.start();
    log.info('Mini Motor iniciado.');
    return this;
  }

  stop() {
    this.loop.stop();
    log.info('Mini Motor detenido.');
    return this;
  }

  onResize() {
    this.glContext.resize();
    this.camera.aspect = this.canvas.width / Math.max(1, this.canvas.height);
  }

  update(dt, t) {
    // 1. Actualizar sistemas registrados
    for (const [name, sys] of this.systems) {
      if (typeof sys.update === 'function') {
        sys.update(dt, t);
      }
    }

    // 2. Actualizar controlador de cámara interactiva
    this.cameraController.update(dt);

    // 3. Actualizar la lógica de la aplicación
    this._userUpdate?.update(dt, t);

    // 4. Actualizar matrices mundiales del grafo de escena
    this.scene.updateWorldMatrices();
  }

  render(t = 0) {
    this.renderer.time = t;
    if (this.environment.dayNight) {
      this.renderer.clearColor = [...this.environment.dayNight.skyColor, 1];
    }
    this.renderer.render(this.scene, this.camera, this.environment);
  }
}
