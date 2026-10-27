import { Material, ProgramManager } from './Material.js';
import foliageVert from '../../shaders/foliage.vert.js';
import foliageFrag from '../../shaders/foliage.frag.js';
import { COLORS } from '../../config/constants.js';

export class FoliageMaterial extends Material {
  constructor(texture, tint = COLORS.leaf) {
    super();
    this.texture = texture;
    this.tint = tint;
    this.cull = false;
    this.transparent = true;
    this.renderOrder = 15;
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'foliage', foliageVert, foliageFrag);
    frame.gl.depthFunc(frame.gl.LESS);
    this.bindCommon(frame, local);
    this.bindLights(frame);
    this.texture.bind(0);
    this.program.setInt('uTexture', 0);
    this.program.setVec3('uTint', this.tint);
    const wind = frame.wind;
    this.program.setVec3('uWindDirection', wind ? wind.direction : [1, 0, 0.2]);
    this.program.setFloat('uWindStrength', wind ? wind.strength : 0.5);
  }
}
