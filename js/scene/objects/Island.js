import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { IslandGeometry } from '../../geometry/IslandGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { sceneConfig } from '../../config/sceneConfig.js';

export class Island extends Object3D {
  constructor(textures) {
    super();
    this.name = 'Island';
    const cfg = sceneConfig.island;
    this.radius = cfg.radius;
    this.flatten = cfg.flatten;

    const terrainTexture = textures['isla_terreno.jpg'] || textures['arena.jpg'];
    const land = new Mesh(
      new IslandGeometry(cfg.radius, cfg.flatten, 28, 56),
      new StandardMaterial(terrainTexture, { shininess: 6, specular: 0.03 }),
    );
    land.position = [0, 0, 0];

    this.add(land);
    this.position = [...cfg.position];
  }

  heightAt(x, z) {
    return IslandGeometry.getHeight(x, z, this.radius, this.flatten);
  }

  coastRadiusAt(theta) {
    return IslandGeometry.getCoastRadius(theta, this.radius);
  }
}
