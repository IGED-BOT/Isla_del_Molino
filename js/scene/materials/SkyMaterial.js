import { Material, ProgramManager } from './Material.js';
import skyVert from '../../shaders/sky.vert.js';
import skyFrag from '../../shaders/sky.frag.js';

export class SkyMaterial extends Material {
  constructor() {
    super();
    this.renderOrder = -20;
    this.depthWrite = false;
    this.cull = false;
    this.zenith = [0.25, 0.5, 0.85];
    this.horizon = [0.75, 0.82, 0.9];
    this.nadir = [0.12, 0.18, 0.22];
    this.starMapTexture = null; // se asigna desde IslaDelMolinoApp
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'sky', skyVert, skyFrag);
    this.bindCommon(frame, local);
    frame.gl.depthFunc(frame.gl.LEQUAL);
    const p = this.program;
    p.setVec3('uZenith', this.zenith);
    p.setVec3('uHorizon', this.horizon);
    p.setVec3('uNadir', this.nadir);
    p.setVec3('uSunDirection', frame.dayNight?.sunDirection ?? [0.85, 0.52, 0.16]);
    p.setVec3('uMoonDirection', frame.dayNight?.moonDirection ?? [-0.85, -0.52, -0.16]);
    p.setFloat('uSunSize', 240.0);
    p.setFloat('uMoonSize', 300.0);

    // Textura real del cielo estrellado (unit 1)
    if (this.starMapTexture) {
      this.starMapTexture.bind(1);
      p.setInt('uStarMap', 1);
      p.setInt('uUseStarMap', 1);
    } else {
      p.setInt('uUseStarMap', 0);
    }
  }
}

