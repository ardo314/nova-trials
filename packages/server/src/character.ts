import { Scene, TransformNode } from "@babylonjs/core";

export class Character {
  private node: TransformNode;

  constructor(private scene: Scene) {
    this.node = new TransformNode("Character", scene);
  }

  get position() {
    return this.node.position;
  }

  get rotation() {
    return this.node.rotation;
  }
}
