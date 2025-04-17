import {
  IDisposable,
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
} from "@babylonjs/core";
import { Character } from ".";
import { CharacterViewSyncSystem } from "./systems/character-view-sync-system";

export class CharacterView implements IDisposable {
  private constructor(
    private readonly body: TransformNode,
    private readonly viewSyncSystem: CharacterViewSyncSystem
  ) {}

  update() {
    this.viewSyncSystem.execute();
  }

  dispose() {
    this.body.dispose();
  }

  static Builder = class {
    private readonly body: TransformNode;
    private readonly viewSyncSystem: CharacterViewSyncSystem;

    constructor(scene: Scene, character: Character) {
      this.body = new TransformNode("characterView", scene);
      this.body.rotationQuaternion = Quaternion.Identity();

      const mesh = MeshBuilder.CreateBox(
        "box",
        { height: 2, width: 1, depth: 1 },
        scene
      );
      mesh.setParent(this.body);
      mesh.position.y = 1;

      this.viewSyncSystem = new CharacterViewSyncSystem(
        this.body,
        character.body
      );
    }

    build() {
      return new CharacterView(this.body, this.viewSyncSystem);
    }
  };
}
