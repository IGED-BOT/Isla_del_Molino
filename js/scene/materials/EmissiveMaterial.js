import { Material, ProgramManager } from './Material.js';
import bodyVert from '../../shaders/body.vert.js';
import bodyFrag from '../../shaders/body.frag.js';

export class EmissiveMaterial extends Material {
  constructor(texture) {
    super();
    this.texture = texture;
    this.renderOrder = -5;
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'body', bodyVert, bodyFrag);
    frame.gl.depthFunc(frame.gl.LESS);
    this.bindCommon(frame, local);
    this.bindLights(frame);
    this.texture.bind(0);
    this.program.setInt('uTexture', 0);
    this.program.setInt('uEmissive', 1);
    this.program.setFloat('uShininess', 1);
    this.program.setFloat('uSpecular', 0);
  }
}
