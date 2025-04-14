import { IDisposable } from "@babylonjs/core";
import { CharacterState } from "@nova-trials/shared";

export class CharacterStateSyncSystem implements IDisposable {
  constructor() {}

  dispose() {}

  execute(state: CharacterState) {
    const { x, y, z } = state.position;
    const { x: rx, y: ry, z: rz } = state.rotation;
    this.node.position.copyFromFloats(x, y, z);
    this.node.rotation.copyFromFloats(rx, ry, rz);
  }
}
