import { Scene } from "@babylonjs/core";
import { Character } from "./character";
import { CharacterViewSyncSystem } from "./systems/character-view-sync-system";
import { getStateCallbacks, Room } from "colyseus.js";
import { CharacterState } from "@nova-trials/shared";
import { CharacterView } from "./components/character-view";

export class RemoteCharacter extends Character {
  private readonly view: CharacterView;
  private readonly syncSystem: CharacterViewSyncSystem;

  constructor(scene: Scene, room: Room, state: CharacterState) {
    super();

    this.view = new CharacterView(scene);

    this.syncSystem = new CharacterViewSyncSystem(
      this.view,
      state,
      getStateCallbacks(room)
    );
  }

  dispose() {
    this.view.dispose();
    this.syncSystem.dispose();
  }

  update() {
    // Interpolate state
  }
}
