import { AbstractEngine, TransformNode, Vector3 } from "@babylonjs/core";
import { CharacterInput } from ".";

const SPEED = 5 / 1000;

export class CharacterMovementSystem {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly body: TransformNode
  ) {}

  execute(input: CharacterInput) {
    const dt = this.engine.getDeltaTime();
    const axis = new Vector3(input.right, 0, input.forward);
    axis.normalize();

    this.body.translate(axis, dt * SPEED);
  }
}
