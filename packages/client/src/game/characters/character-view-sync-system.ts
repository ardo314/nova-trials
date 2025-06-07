import { IDisposable } from "@babylonjs/core";
import { SchemaCallbackProxy } from "@colyseus/schema";
import { CharacterState } from "@nova-trials/shared";
import { CharacterView } from "./character-view";

export class CharacterViewSyncSystem implements IDisposable {
  private readonly detachPositionListener: () => void;
  private readonly detachRotationListener: () => void;

  constructor(
    view: CharacterView,
    state: CharacterState,
    proxy: SchemaCallbackProxy<CharacterState>
  ) {
    this.detachPositionListener = proxy(state).position.onChange(() => {
      view.position.copyFromFloats(
        state.position.x,
        state.position.y,
        state.position.z
      );
    });

    this.detachRotationListener = proxy(state).rotation.onChange(() => {
      view.yaw = state.rotation.yaw;
    });
  }

  dispose() {
    this.detachPositionListener();
    this.detachRotationListener();
  }
}
