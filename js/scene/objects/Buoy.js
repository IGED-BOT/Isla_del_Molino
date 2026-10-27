import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { CylinderGeometry } from '../../geometry/CylinderGeometry.js';
import { SphereGeometry } from '../../geometry/SphereGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';
import { Buoyancy } from '../../world/Buoyancy.js';
import { Vec2 } from '../../math/Vec2.js';

/**
 * Boya marítima que flota en mar abierto y se desplaza suavemente con la corriente.
 * Reutiliza las geometrías procedurales, materiales existentes y el sistema de flotación.
 */
export class Buoy extends Object3D {
  constructor(textures, config = {}) {
    super();
    this.name = 'Buoy';

    const position = config.position ?? [0, 0, 0];
    this.anchor = [position[0], position[1] ?? 0, position[2]];

    const drift = config.drift ?? {};
    const dir = drift.direction ?? [1.0, 0.0];
    this.driftDir = Vec2.normalize(dir);
    this.driftSpeed = drift.speed ?? 0.5;
    this.driftRadius = drift.radius ?? 0.75;
    this.phase = drift.phase ?? 0.0;
    this.time = 0;

    // Materiales existentes del motor
    const redMat = new StandardMaterial(textures['techo.jpg'], { shininess: 24, specular: 0.18 });
    const whiteMat = new StandardMaterial(textures['vela.jpg'] || textures['arena.jpg'], { shininess: 20, specular: 0.15 });
    const mastMat = new StandardMaterial(textures['madera.jpg'], { shininess: 8, specular: 0.05 });
    const beaconMat = new StandardMaterial(textures['sol.jpg'], { shininess: 32, specular: 0.3 });

    // 1. Cuerpo principal flotante (flotador cónico rojizo)
    const hullGeo = GeometryFactory.get('buoy-hull', () => new CylinderGeometry(0.30, 0.44, 0.48, 14));
    const hull = new Mesh(hullGeo, redMat);
    hull.position = [0, 0.04, 0];

    // 2. Banda reflectante blanca intermedia de señalización
    const bandGeo = GeometryFactory.get('buoy-band', () => new CylinderGeometry(0.33, 0.35, 0.12, 14));
    const band = new Mesh(bandGeo, whiteMat);
    band.position = [0, 0.18, 0];

    // 3. Mástil vertical de soporte
    const mastGeo = GeometryFactory.get('buoy-mast', () => new CylinderGeometry(0.035, 0.045, 0.7, 8));
    const mast = new Mesh(mastGeo, mastMat);
    mast.position = [0, 0.58, 0];

    // 4. Baliza superior / marca de tope esférica
    const topGeo = GeometryFactory.get('buoy-top', () => new SphereGeometry(0.12, 10, 12));
    const top = new Mesh(topGeo, beaconMat);
    top.position = [0, 0.98, 0];

    this.add(hull, band, mast, top);
    this.position = [...this.anchor];
  }

  update(dt, waves) {
    this.time += dt;
    const t = this.time * this.driftSpeed + this.phase;

    // Desplazamiento horizontal suave y acotado alrededor de la posición de anclaje
    const u = Math.sin(t) * this.driftRadius;
    const v = Math.cos(t * 0.75 + 0.6) * (this.driftRadius * 0.45);

    const x = this.anchor[0] + this.driftDir[0] * u - this.driftDir[1] * v;
    const z = this.anchor[2] + this.driftDir[1] * u + this.driftDir[0] * v;

    // Flotación y balanceo dinámico con las olas existentes
    Buoyancy.apply(this, waves, x, z, dt);
  }
}
