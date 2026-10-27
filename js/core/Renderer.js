import { GLContext } from './GLContext.js';
import { Mat4 } from '../math/Mat4.js';
import { Mat3 } from '../math/Mat3.js';

export class Renderer {
  // Renderizador de la escena, encargado de dibujar mallas, luces y materiales en el lienzo
  constructor(gl, canvas) {
    this.gl = gl;
    this.canvas = canvas;
    this.time = 0;
    this.clearColor = [0.35, 0.55, 0.78, 1];
    this._firstFrame = true;
  }
  // Renderiza la escena completa desde la perspectiva de la cámara, aplicando luces y materiales
  render(scene, camera, lights = {}) {
    const gl = this.gl;
    if (GLContext.resize(this.canvas) || this._firstFrame) {
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this._firstFrame = false;
    }

    camera.aspect = this.canvas.width / Math.max(1, this.canvas.height);
    const cameraPosition = camera.eye;

    const sky = this.clearColor;
    gl.clearColor(sky[0], sky[1], sky[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const frame = {
      gl,
      scene,
      viewMatrix: camera.viewMatrix,
      projectionMatrix: camera.projectionMatrix,
      cameraPosition,
      time: this.time,
      wind: lights.wind,
      waves: lights.waves,
      dayNight: lights.dayNight,
    };

    const meshes = scene.collectMeshes();
    meshes.sort((a, b) => (a.material.renderOrder ?? 0) - (b.material.renderOrder ?? 0));

    for (const mesh of meshes) {
      if (!mesh.visible) continue;
      mesh.ensureGPU(gl);
      const model = mesh.worldMatrix;
      const normalMat = Mat3.fromMat4(Mat4.normalMatrix(model));
      mesh.material.bind(frame, {
        modelMatrix: model,
        normalMatrix: normalMat,
        mesh,
      });
      mesh.vao.bind();
      if (mesh.geometry.indices) {
        gl.drawElements(mesh.drawMode ?? gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(mesh.drawMode ?? gl.TRIANGLES, 0, mesh.vertexCount);
      }
    }

    gl.bindVertexArray(null);
  }
}
