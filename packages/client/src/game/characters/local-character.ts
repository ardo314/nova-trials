import { HavokPlugin, Scene } from "@babylonjs/core";
import { Character } from "./character";
import { CharacterTarget } from "./components/character-target";
import { CharacterState } from "@nova-trials/shared";
import { Room } from "colyseus.js";
import { Input } from "../input";
import { CharacterKinematic } from "./components/character-kinematic";
import { CharacterInputSystem } from "./components/character-input-system";
import { CharacterInteractionSystem } from "./components/character-interaction-system";
import { CharacterMovementSystem } from "./components/character-movement-system";
import { CharacterSendSystem } from "./components/character-send-system";
import { CharacterTargetSystem } from "./components/character-target-system";
import { getCharacterController } from "./types/character-physics";

export class LocalCharacter extends Character {
  readonly kinematic: CharacterKinematic;

  private readonly inputSystem: CharacterInputSystem;
  private readonly movementSystem: CharacterMovementSystem;
  private readonly targetSystem: CharacterTargetSystem;
  private readonly interactionSystem: CharacterInteractionSystem;
  private readonly sendSystem: CharacterSendSystem;

  constructor(
    physicsEngine: HavokPlugin,
    scene: Scene,
    input: Input,
    room: Room,
    state: CharacterState
  ) {
    super();

    this.kinematic = new CharacterKinematic(scene);
    this.kinematic.position.x = state.position.x;
    this.kinematic.position.y = state.position.y;
    this.kinematic.position.z = state.position.z;
    this.kinematic.yaw = state.rotation.yaw;
    this.kinematic.pitch = state.rotation.pitch;

    const characterController = getCharacterController(
      scene,
      this.kinematic.body.position
    );

    const characterInput = new CharacterInput();
    const target = new CharacterTarget();
    const engine = scene.getEngine();

    this.inputSystem = new CharacterInputSystem(input, characterInput);

    this.movementSystem = new CharacterMovementSystem(
      engine,
      this.kinematic,
      characterController,
      characterInput
    );

    this.targetSystem = new CharacterTargetSystem(
      physicsEngine,
      this.kinematic.head,
      target
    );

    this.interactionSystem = new CharacterInteractionSystem(
      target,
      characterInput
    );

    this.sendSystem = new CharacterSendSystem(engine, room, this.kinematic);
  }

  dispose() {
    this.kinematic.dispose();
    this.inputSystem.dispose();
  }

  update() {
    this.inputSystem.execute();
    this.movementSystem.execute();
    this.targetSystem.execute();
    this.interactionSystem.execute();
    this.sendSystem.execute();
  }
}
