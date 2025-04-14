import { IDisposable, TransformNode } from "@babylonjs/core";
import { CharacterState } from "@nova-trials/shared";

export class CharacterStateSyncSystem implements IDisposable {
  constructor(private readonly body: TransformNode) {
    const $ = getStateCallbacks(this.room!);
    const foo = $(state);
    foo.position.onChange(() => character.fromState(state));
  }

  dispose() {}

  execute(state: CharacterState) {
    const { x, y, z } = state.position;
    const { x: rx, y: ry, z: rz } = state.rotation;
    this.body.position.copyFromFloats(x, y, z);
    this.body.rotation.copyFromFloats(rx, ry, rz);
  }
}
