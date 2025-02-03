import { IDisposable, Scene, TransformNode } from "@babylonjs/core";

export interface CharacterInput {
  forward: number;
  right: number;
}

export class Character implements IDisposable {
  readonly node: TransformNode;
  readonly headNode: TransformNode;

  constructor(scene: Scene) {
    this.node = new TransformNode("character", scene);

    this.headNode = new TransformNode("head", scene);
    this.headNode.setParent(this.node);
  }

  dispose(): void {
    this.node.dispose();
  }
}
