import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { CylinderGeometry } from '../../geometry/CylinderGeometry.js';
import { SphereGeometry } from '../../geometry/SphereGeometry.js';
import { PalmFrondGeometry } from '../../geometry/PalmFrondGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { FoliageMaterial } from '../materials/FoliageMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';

export { PalmFrondGeometry };

export class PalmTree extends Object3D {
  constructor(textures, { position = [0, 0, 0], scale = 1, yaw = 0 } = {}) {
    super();
    this.name = 'PalmTree';

    const trunkH = 3.2;
    const baseY = 1.4;
    const rotX = 0.10;
    const rotZ = 0.06;

    const trunk = new Mesh(
      GeometryFactory.get('palm-trunk', () => new CylinderGeometry(0.10, 0.22, trunkH, 10)),
      new StandardMaterial(textures['madera.jpg'], { shininess: 8, specular: 0.04 }),
    );
    trunk.position = [0, baseY, 0];
    trunk.rotation = [rotX, 0, rotZ];

    // Cálculo trigonométrico exacto del extremo superior del tronco
    const halfH = trunkH * 0.5;
    const topX = -halfH * Math.sin(rotZ);
    const topY = baseY + halfH * Math.cos(rotZ) * Math.cos(rotX);
    const topZ = halfH * Math.sin(rotX);

    this.crown = new Object3D();
    this.crown.position = [topX, topY, topZ];

    // Copa central y cocos para disimular la unión
    const crownNut = new Mesh(
      GeometryFactory.get('palm-nut-hub', () => new SphereGeometry(0.18, 8, 10)),
      new StandardMaterial(textures['madera.jpg']),
    );
    this.crown.add(crownNut);

    const coconutGeo = GeometryFactory.get('palm-coconut', () => new SphereGeometry(0.11, 6, 8));
    const coconutMat = new StandardMaterial(textures['madera.jpg'], { shininess: 12, specular: 0.08 });
    for (let c = 0; c < 3; c++) {
      const coco = new Mesh(coconutGeo, coconutMat);
      const cAngle = (c / 3) * Math.PI * 2;
      coco.position = [Math.cos(cAngle) * 0.14, -0.08, Math.sin(cAngle) * 0.14];
      this.crown.add(coco);
    }

    // Hojas curvadas que nacen con precisión milimétrica del centro de la copa
    const frondGeo = GeometryFactory.get('palm-frond-curved', () => new PalmFrondGeometry(0.92, 2.5, 7));
    const leafMat = new FoliageMaterial(textures['palmera_hoja.png']);

    const numFronds = 9;
    for (let i = 0; i < numFronds; i++) {
      const holder = new Object3D();
      const azim = (i / numFronds) * Math.PI * 2;
      const pitch = i % 2 === 0 ? 0.32 : 0.52;
      holder.rotation = [pitch, azim, 0];

      const frond = new Mesh(frondGeo, leafMat);
      frond.position = [0, 0, 0]; // Nace exactamente del centro
      holder.add(frond);
      this.crown.add(holder);
    }

    this.add(trunk, this.crown);
    this.position = [...position];
    this.rotation = [0, yaw, 0];
    this.scale = [scale, scale, scale];
  }

  update(dt, wind) {
    if (!wind) return;
    const sway = Math.sin(wind.time * 2.2 + this.position[0] * 1.5) * 0.045 * wind.strength;
    this.crown.rotation = [sway, 0, sway * 0.6];
  }
}
