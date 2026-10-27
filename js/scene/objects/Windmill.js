import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { CylinderGeometry } from '../../geometry/CylinderGeometry.js';
import { ConeGeometry } from '../../geometry/ConeGeometry.js';
import { BoxGeometry } from '../../geometry/BoxGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';

export class Windmill extends Object3D {
  constructor(textures) {
    super();
    this.name = 'Windmill';

    const wood = new StandardMaterial(textures['madera.jpg'], { shininess: 10, specular: 0.06 });
    const roof = new StandardMaterial(textures['techo.jpg'], { shininess: 18, specular: 0.15 });
    const sailMat = new StandardMaterial(textures['vela.jpg'] || textures['madera.jpg'], { shininess: 6, specular: 0.02 });

    // Torre del molino (cilindro cónico truncado)
    const body = new Mesh(
      GeometryFactory.get('mill-body', () => new CylinderGeometry(0.55, 0.88, 3.4, 20)),
      wood,
    );
    body.position = [0, 1.7, 0];

    // Puerta de entrada en la base de la torre
    const door = new Mesh(
      GeometryFactory.get('mill-door', () => new BoxGeometry(0.65, 1.1, 0.14)),
      new StandardMaterial(textures['madera.jpg'], { shininess: 4, specular: 0.02 }),
    );
    door.position = [0, 0.6, 0.85];

    // Ventana superior en la fachada
    const win = new Mesh(
      GeometryFactory.get('mill-win', () => new BoxGeometry(0.35, 0.45, 0.12)),
      new StandardMaterial(textures['madera.jpg'], { shininess: 14, specular: 0.1 }),
    );
    win.position = [0, 2.3, 0.68];

    // Techo cónico tradicional
    const cap = new Mesh(
      GeometryFactory.get('mill-cone', () => new ConeGeometry(0.96, 1.25, 20)),
      roof,
    );
    cap.position = [0, 3.95, 0];

    // Manguito fijo del eje en la torre
    const axleHousing = new Mesh(
      GeometryFactory.get('mill-axle-housing', () => new CylinderGeometry(0.14, 0.14, 0.45, 10)),
      wood,
    );
    axleHousing.rotation = [Math.PI / 2, 0, 0];
    axleHousing.position = [0, 3.15, 0.62];

    // CONJUNTO ROTATORIO (Rotor completo: buje cónico central + cruz + aspas con lona)
    this.hub = new Object3D();
    this.hub.position = [0, 3.15, 0.88];

    // Buje central que gira con las aspas (cono frontal hacia +Z)
    const noseCone = new Mesh(
      GeometryFactory.get('mill-hub-nose', () => new ConeGeometry(0.24, 0.38, 14)),
      wood,
    );
    noseCone.rotation = [-Math.PI / 2, 0, 0];
    noseCone.position = [0, 0, 0.19];
    this.hub.add(noseCone);

    // Eje central visible que gira solidario
    const rotatingShaft = new Mesh(
      GeometryFactory.get('mill-hub-shaft', () => new CylinderGeometry(0.10, 0.10, 0.3, 10)),
      wood,
    );
    rotatingShaft.rotation = [Math.PI / 2, 0, 0];
    rotatingShaft.position = [0, 0, 0.05];
    this.hub.add(rotatingShaft);

    // Los dos travesaños maestros en cruz que cruzan el buje
    const crossBeamGeo = GeometryFactory.get('mill-cross-beam', () => new BoxGeometry(0.12, 4.8, 0.08));
    const beam1 = new Mesh(crossBeamGeo, wood);
    const beam2 = new Mesh(crossBeamGeo, wood);
    beam2.rotation = [0, 0, Math.PI / 2];
    this.hub.add(beam1, beam2);

    // Las 4 aspas con su marco de madera y paño de lona de molino tradicional
    const sailClothGeo = GeometryFactory.get('mill-sail-cloth', () => new BoxGeometry(0.52, 1.85, 0.02));
    const ribGeo = GeometryFactory.get('mill-sail-rib', () => new BoxGeometry(0.54, 0.04, 0.04));

    for (let i = 0; i < 4; i++) {
      const armHolder = new Object3D();
      armHolder.rotation = [0, 0, i * Math.PI / 2];

      // Paño de tela/lona del aspa (desfasado al lado del mástil como en molinos reales)
      const sail = new Mesh(sailClothGeo, sailMat);
      sail.position = [0.26, 1.35, 0.02];
      armHolder.add(sail);

      // Travesaños de madera de la celosía sobre la tela
      for (let r = 0; r < 4; r++) {
        const rib = new Mesh(ribGeo, wood);
        rib.position = [0.26, 0.65 + r * 0.45, 0.04];
        armHolder.add(rib);
      }

      this.hub.add(armHolder);
    }

    this.add(body, door, win, cap, axleHousing, this.hub);
    this.spin = 0;
  }

  update(dt, wind) {
    const speed = 0.8 + (wind?.strength ?? 0.5) * 1.6;
    this.spin += dt * speed;
    this.hub.rotation[2] = this.spin;
  }
}
