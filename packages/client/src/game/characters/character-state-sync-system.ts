import { IDisposable, TransformNode } from "@babylonjs/core";
import { GetCallbackProxy } from "@colyseus/schema";
import { CharacterState } from "@nova-trials/shared";

export class CharacterStateSyncSystem implements IDisposable {
  private readonly detachPositionListener: () => void;
  private readonly detachRotationListener: () => void;

  constructor(
    private readonly body: TransformNode,
    state: CharacterState,
    proxy: GetCallbackProxy
  ) {
    this.detachPositionListener = proxy(state).position.onChange(() => {
      this.body.position.copyFromFloats(x, y, z);
    });

    this.detachRotationListener = proxy(state).rotation.onChange(() => {
      this.body.rotation.copyFromFloats(x, y, z);
    });
  }

  dispose() {
    this.detachPositionListener();
    this.detachRotationListener();
  }
}
