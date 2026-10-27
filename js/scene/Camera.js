import { Mat4 } from '../math/Mat4.js';
import { CAMERA } from '../config/constants.js';

export class Camera {
  constructor({
    target = CAMERA.target,
    distancia = CAMERA.distancia,
    azimut = CAMERA.azimut,
    elevacion = CAMERA.elevacion,
    fov = Math.PI / 4,
    near = 0.1,
    far = 250,
  } = {}) {
    this.target = [...target];
    this.distancia = distancia;
    this.azimut = azimut;
    this.elevacion = elevacion;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = 1;
  }

  get eye() {
    const cosE = Math.cos(this.elevacion);
    return [
      this.target[0] + this.distancia * cosE * Math.sin(this.azimut),
      this.target[1] + this.distancia * Math.sin(this.elevacion),
      this.target[2] + this.distancia * cosE * Math.cos(this.azimut),
    ];
  }

  get viewMatrix() {
    return Mat4.lookAt(this.eye, this.target, [0, 1, 0]);
  }

  get projectionMatrix() {
    return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
  }
}
