import { TransformNode } from "@babylonjs/core";

export class Character {
  private node: TransformNode;

  get position() {
    return this.node.position;
  }

  get rotation() {
    return this.node.rotation;
  }

  constructor() {
    this.node = new TransformNode("Character");
  }
}
