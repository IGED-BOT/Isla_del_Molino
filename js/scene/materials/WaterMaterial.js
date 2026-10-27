import { Material, ProgramManager } from './Material.js';
import waterVert from '../../shaders/water.vert.js';
import waterFrag from '../../shaders/water.frag.js';
import { COLORS, WAVES } from '../../config/constants.js';

export class WaterMaterial extends Material {
  constructor() {
    super();
    this.transparent = true;
    this.renderOrder = 20;
    this.cull = false;
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'water', waterVert, waterFrag);
    frame.gl.depthFunc(frame.gl.LESS);
    this.bindCommon(frame, local);
    this.bindLights(frame);
    const p = this.program;
    p.setVec3('uDeepColor', COLORS.waterDeep);
    p.setVec3('uShallowColor', COLORS.waterShallow);
    const waves = frame.waves?.waves ?? WAVES;
    const pack = (w) => new Float32Array([w.direction[0], w.direction[1], w.amplitude, w.length]);
    frame.gl.uniform4fv(p.uniform('uWave0'), pack(waves[0]));
    frame.gl.uniform4fv(p.uniform('uWave1'), pack(waves[1]));
    frame.gl.uniform4fv(p.uniform('uWave2'), pack(waves[2]));
  }
}
