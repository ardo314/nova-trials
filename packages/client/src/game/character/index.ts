import {
  DeviceSourceManager,
  IDisposable,
  Scene,
  TransformNode,
} from "@babylonjs/core";
import { CharacterInputSystem } from "./character-input-system";
import { CharacterMovementSystem } from "./character-movement-system";
import { CharacterStateSyncSystem } from "./character-state-sync-system";
import { CharacterSendSystem } from "./character-send-system";
import { Room } from "colyseus.js";

export interface CharacterInput {
  forward: number;
  right: number;
}

export class Character implements IDisposable {
  readonly node: TransformNode;
  readonly headNode: TransformNode;

  private constructor(
    scene: Scene,
    private readonly inputSystem?: CharacterInputSystem,
    private readonly movementSystem?: CharacterMovementSystem,
    private readonly sendSystem?: CharacterSendSystem,
    private readonly stateSyncSystem?: CharacterStateSyncSystem
  ) {
    this.node = new TransformNode("character", scene);

    this.headNode = new TransformNode("head", scene);
    this.headNode.setParent(this.node);
    this.headNode.position.y = 1.5;
  }

  dispose() {
    this.node.dispose();
    this.inputSystem?.dispose();
    this.stateSyncSystem?.dispose();
  }

  update() {
    if (this.inputSystem && this.movementSystem && this.sendSystem) {
      const input = this.inputSystem.execute();
      this.movementSystem.execute(input, this.node);
      this.sendSystem.execute(this.node);
    }
  }

  static Builder = class {
    private readonly scene: Scene;

    private inputSystem?: CharacterInputSystem;
    private movementSystem?: CharacterMovementSystem;
    private sendSystem?: CharacterSendSystem;
    private stateSyncSystem?: CharacterStateSyncSystem;

    constructor(scene: Scene) {
      this.scene = scene;
    }

    withControls(dsm: DeviceSourceManager, room: Room): this {
      const engine = this.scene.getEngine();
      this.inputSystem = new CharacterInputSystem(dsm);
      this.movementSystem = new CharacterMovementSystem(engine);
      this.sendSystem = new CharacterSendSystem(engine, room);
      return this;
    }

    withStateSync(): this {
      this.stateSyncSystem = new CharacterStateSyncSystem();
      return this;
    }

    build(): Character {
      const character = new Character(
        this.scene,
        this.inputSystem,
        this.movementSystem,
        this.sendSystem,
        this.stateSyncSystem
      );
      return character;
    }
  };
}
