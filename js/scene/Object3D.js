import { Mat4 } from '../math/Mat4.js';

export class Object3D {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.parent = null;
    this.children = [];
    this.localMatrix = Mat4.identity();
    this.worldMatrix = Mat4.identity();
    this.visible = true;
    this.name = '';
  }

  add(...nodes) {
    for (const node of nodes) {
      if (!node) continue;
      if (node.parent) node.parent.remove(node);
      node.parent = this;
      this.children.push(node);
    }
    return this;
  }

  remove(node) {
    const i = this.children.indexOf(node);
    if (i >= 0) {
      this.children.splice(i, 1);
      node.parent = null;
    }
  }

  updateLocalMatrix() {
    this.localMatrix = Mat4.compose(this.position, this.rotation, this.scale);
  }

  updateWorldMatrix() {
    this.updateLocalMatrix();
    if (this.parent) {
      this.worldMatrix = Mat4.multiply(this.parent.worldMatrix, this.localMatrix);
    } else {
      this.worldMatrix = this.localMatrix;
    }
    for (const child of this.children) {
      child.updateWorldMatrix();
    }
  }
}
