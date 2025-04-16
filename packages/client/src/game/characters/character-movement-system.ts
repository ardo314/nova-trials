import { AbstractEngine, Space, TransformNode, Vector3 } from "@babylonjs/core";
import { CharacterInput } from ".";

const SPEED = 5 / 1000;

export class CharacterMovementSystem {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly body: TransformNode,
    private readonly head: TransformNode
  ) {}

  execute(input: CharacterInput) {
    const dt = this.engine.getDeltaTime();

    this.body.rotate(Vector3.Up(), input.yaw, Space.LOCAL);
    this.head.rotate(Vector3.Right(), input.pitch, Space.LOCAL);

    const axis = new Vector3(input.right, 0, input.forward);
    axis.normalize();

    this.body.translate(axis, dt * SPEED);
  }
}
