import { Material, ProgramManager } from './Material.js';
import bodyVert from '../../shaders/body.vert.js';
import bodyFrag from '../../shaders/body.frag.js';

export class StandardMaterial extends Material {
  constructor(texture, { shininess = 24, specular = 0.12 } = {}) {
    super();
    this.texture = texture;
    this.shininess = shininess;
    this.specular = specular;
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'body', bodyVert, bodyFrag);
    frame.gl.depthFunc(frame.gl.LESS);
    this.bindCommon(frame, local);
    this.bindLights(frame);
    this.texture.bind(0);
    this.program.setInt('uTexture', 0);
    this.program.setInt('uEmissive', 0);
    this.program.setFloat('uShininess', this.shininess);
    this.program.setFloat('uSpecular', this.specular);
  }
}
