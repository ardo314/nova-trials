import { AbstractEngine, Vector3 } from "@babylonjs/core";
import { CharacterInput } from "../components/character-input";
import { CharacterKinematic } from "../components/character-kinematic";

const SPEED = 5 / 1000;

export class CharacterMovementSystem {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly kinematic: CharacterKinematic,
    private readonly input: CharacterInput
  ) {}

  execute() {
    const dt = this.engine.getDeltaTime();

    this.kinematic.yaw += this.input.yaw;
    this.kinematic.pitch += this.input.pitch;

    const axis = new Vector3(this.input.right, 0, this.input.forward);
    axis.normalize();

    this.kinematic.body.translate(axis, dt * SPEED);
  }
}
