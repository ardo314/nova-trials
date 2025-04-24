import { AbstractEngine, TransformNode, Vector3 } from "@babylonjs/core";
import { CharacterRotation } from "../components/character-rotation";
import { CharacterInput } from "../components/character-input";

const SPEED = 5 / 1000;

export class CharacterMovementSystem {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly body: TransformNode,
    private readonly rotation: CharacterRotation,
    private readonly input: CharacterInput
  ) {}

  execute() {
    const dt = this.engine.getDeltaTime();

    this.rotation.yaw += this.input.yaw;
    this.rotation.pitch += this.input.pitch;

    const axis = new Vector3(this.input.right, 0, this.input.forward);
    axis.normalize();

    this.body.translate(axis, dt * SPEED);
  }
}
