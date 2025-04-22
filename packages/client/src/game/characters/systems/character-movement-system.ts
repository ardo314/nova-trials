import { AbstractEngine, TransformNode, Vector3 } from "@babylonjs/core";
import { CharacterRotation } from "../components/character-rotation";
import { CharacterInput } from "../types/character-input";

const SPEED = 5 / 1000;

export class CharacterMovementSystem {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly body: TransformNode,
    private readonly rotation: CharacterRotation
  ) {}

  execute(input: CharacterInput) {
    const dt = this.engine.getDeltaTime();

    this.rotation.yaw += input.yaw;
    this.rotation.pitch += input.pitch;

    const axis = new Vector3(input.right, 0, input.forward);
    axis.normalize();

    this.body.translate(axis, dt * SPEED);
  }
}
