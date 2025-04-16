import { IDisposable, TransformNode } from "@babylonjs/core";
import { GetCallbackProxy } from "@colyseus/schema";
import { CharacterState } from "@nova-trials/shared";

export class CharacterStateSyncSystem implements IDisposable {
  private readonly detachPositionListener: () => void;
  private readonly detachRotationListener: () => void;

  constructor(
    private readonly body: TransformNode,
    private readonly head: TransformNode,
    state: CharacterState,
    proxy: GetCallbackProxy
  ) {
    this.detachPositionListener = proxy(state).position.onChange(() => {
      this.body.position.copyFromFloats(
        state.position.x,
        state.position.y,
        state.position.z
      );
    });

    this.detachRotationListener = proxy(state).rotation.onChange(() => {
      this.body.rotation.y = state.rotation.y;
      this.head.rotation.x = state.rotation.x;
    });
  }

  dispose() {
    this.detachPositionListener();
    this.detachRotationListener();
  }
}
