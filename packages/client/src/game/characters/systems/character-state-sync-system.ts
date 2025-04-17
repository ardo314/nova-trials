import { IDisposable, TransformNode } from "@babylonjs/core";
import { GetCallbackProxy } from "@colyseus/schema";
import { CharacterState } from "@nova-trials/shared";
import { CharacterRotation } from "../components/character-rotation";

export class CharacterStateSyncSystem implements IDisposable {
  private readonly detachPositionListener: () => void;
  private readonly detachRotationListener: () => void;

  constructor(
    private readonly body: TransformNode,
    private readonly rotation: CharacterRotation,
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
      this.rotation.yaw = state.rotation.yaw;
      this.rotation.pitch = state.rotation.pitch;
    });
  }

  dispose() {
    this.detachPositionListener();
    this.detachRotationListener();
  }
}
