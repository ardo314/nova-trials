import {
  DeviceSourceManager,
  IDisposable,
  Quaternion,
  Scene,
  TransformNode,
} from "@babylonjs/core";
import { CharacterInputSystem } from "./systems/character-input-system";
import { CharacterMovementSystem } from "./systems/character-movement-system";
import { CharacterStateSyncSystem } from "./systems/character-state-sync-system";
import { CharacterSendSystem } from "./systems/character-send-system";
import { getStateCallbacks, Room } from "colyseus.js";
import { CharacterState } from "@nova-trials/shared";
import { CharacterRotation } from "./components/character-rotation";

export interface CharacterInput {
  forward: number;
  right: number;

  pitch: number;
  yaw: number;
}

export class Character implements IDisposable {
  private constructor(
    readonly body: TransformNode,
    readonly head: TransformNode,
    private readonly inputSystem?: CharacterInputSystem,
    private readonly movementSystem?: CharacterMovementSystem,
    private readonly sendSystem?: CharacterSendSystem,
    private readonly stateSyncSystem?: CharacterStateSyncSystem
  ) {}

  dispose() {
    this.body.dispose();
    this.inputSystem?.dispose();
    this.stateSyncSystem?.dispose();
  }

  update() {
    if (this.inputSystem && this.movementSystem && this.sendSystem) {
      const input = this.inputSystem.execute();
      this.movementSystem.execute(input);
      this.sendSystem.execute();
    }
  }

  get isLocal(): boolean {
    return (
      this.inputSystem !== undefined &&
      this.movementSystem !== undefined &&
      this.sendSystem !== undefined
    );
  }

  get isRemote(): boolean {
    return this.stateSyncSystem !== undefined;
  }

  static Builder = class {
    private readonly body: TransformNode;
    private readonly head: TransformNode;
    private readonly rotation: CharacterRotation;

    private inputSystem?: CharacterInputSystem;
    private movementSystem?: CharacterMovementSystem;
    private sendSystem?: CharacterSendSystem;
    private stateSyncSystem?: CharacterStateSyncSystem;

    constructor(private readonly scene: Scene) {
      this.body = new TransformNode("character", this.scene);
      this.body.rotationQuaternion = Quaternion.Identity();

      this.head = new TransformNode("head", this.scene);
      this.head.setParent(this.body);
      this.head.position.y = 1.5;
      this.head.rotationQuaternion = Quaternion.Identity();

      this.rotation = new CharacterRotation(this.body, this.head);
    }

    withControls(dsm: DeviceSourceManager, room: Room): this {
      const engine = this.scene.getEngine();
      this.inputSystem = new CharacterInputSystem(dsm);
      this.movementSystem = new CharacterMovementSystem(
        engine,
        this.body,
        this.head
      );
      this.sendSystem = new CharacterSendSystem(
        engine,
        room,
        this.body,
        this.rotation
      );
      return this;
    }

    withStateSync(room: Room, state: CharacterState): this {
      this.stateSyncSystem = new CharacterStateSyncSystem(
        this.body,
        this.rotation,
        state,
        getStateCallbacks(room)
      );
      return this;
    }

    build(): Character {
      const character = new Character(
        this.body,
        this.head,
        this.inputSystem,
        this.movementSystem,
        this.sendSystem,
        this.stateSyncSystem
      );
      return character;
    }
  };
}
