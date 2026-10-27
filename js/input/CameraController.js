import { CAMERA } from '../config/constants.js';
import { KEYBINDINGS, ACTIONS } from './keybindings.js';
import { MathUtils } from '../math/MathUtils.js';

export class CameraController {
  constructor(camera, input) {
    this.camera = camera;
    this.input = input;
    this._defaults = {
      target: [...camera.target],
      distancia: camera.distancia,
      azimut: camera.azimut,
      elevacion: camera.elevacion,
    };
  }

  update(dt) {
    const cam = this.camera;
    const { dx, dy } = this.input.consumeMouseDelta();
    if (this.input.mouse.down) {
      cam.azimut -= dx * CAMERA.sensibilidadMouse;
      cam.elevacion += dy * CAMERA.sensibilidadMouse;
    }

    const wheel = this.input.consumeWheel();
    cam.distancia += wheel * CAMERA.sensibilidadZoom;

    const orbitSpeed = 1.1;
    const zoomSpeed = 8.0;
    for (const [code, action] of Object.entries(KEYBINDINGS)) {
      if (!this.input.isDown(code)) continue;
      if (action === ACTIONS.orbitLeft) cam.azimut += orbitSpeed * dt;
      if (action === ACTIONS.orbitRight) cam.azimut -= orbitSpeed * dt;
      if (action === ACTIONS.orbitUp) cam.elevacion += orbitSpeed * dt;
      if (action === ACTIONS.orbitDown) cam.elevacion -= orbitSpeed * dt;
      if (action === ACTIONS.zoomIn) cam.distancia -= zoomSpeed * dt;
      if (action === ACTIONS.zoomOut) cam.distancia += zoomSpeed * dt;
      if (action === ACTIONS.reset) this.reset();
    }

    const limite = Math.PI / 2 - 0.05;
    cam.elevacion = MathUtils.clamp(cam.elevacion, -limite, limite);
    cam.distancia = MathUtils.clamp(cam.distancia, CAMERA.distanciaMin, CAMERA.distanciaMax);
  }

  reset() {
    Object.assign(this.camera, {
      target: [...this._defaults.target],
      distancia: this._defaults.distancia,
      azimut: this._defaults.azimut,
      elevacion: this._defaults.elevacion,
    });
  }
}
