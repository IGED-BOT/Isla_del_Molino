import { Object3D } from './Object3D.js';
import { Mesh } from './Mesh.js';

export class Scene extends Object3D {
  constructor() {
    super();
    this.lights = [];
  }

  add(...nodes) {
    for (const node of nodes) {
      if (node && node.kind) this.lights.push(node);
    }
    return super.add(...nodes);
  }

  collectMeshes(list = [], node = this) {
    if (node instanceof Mesh && node.visible) list.push(node);
    for (const child of node.children) this.collectMeshes(list, child);
    return list;
  }

  updateWorldMatrices() {
    this.updateWorldMatrix();
  }
}
