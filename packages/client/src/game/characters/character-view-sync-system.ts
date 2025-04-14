import { TransformNode } from "@babylonjs/core";

export class CharacterViewSyncSystem {
  constructor(
    private readonly body: TransformNode,
    private readonly characterBody: TransformNode
  ) {}

  execute() {
    this.body.position.copyFrom(this.characterBody.position);
    this.body.rotation.copyFrom(this.characterBody.rotation);
  }
}
