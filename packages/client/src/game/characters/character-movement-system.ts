import {
  AbstractEngine,
  PhysicsCharacterController,
  Vector3,
} from "@babylonjs/core";
import { CharacterInput } from "./character-input";
import { CharacterKinematic } from "./character-kinematic";
import { IUpdate, update } from "@nova-trials/shared";

const SPEED = 5;

export class CharacterMovementSystem implements IUpdate {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly kinematic: CharacterKinematic,
    private readonly controller: PhysicsCharacterController,
    private readonly input: CharacterInput
  ) {}

  [update]() {
    const dt = this.engine.getDeltaTime() / 1000;

    this.kinematic.yaw += this.input.yaw;
    this.kinematic.pitch += this.input.pitch;

    const velocity = new Vector3();

    this.kinematic.body.forward.scaleAndAddToRef(this.input.forward, velocity);
    this.kinematic.body.right.scaleAndAddToRef(this.input.right, velocity);
    velocity.normalize();
    velocity.scaleInPlace(SPEED);

    const support = this.controller.checkSupport(dt, Vector3.Down());
    this.controller.setVelocity(velocity);
    this.controller.integrate(dt, support, Vector3.Zero());

    this.kinematic.position.copyFrom(this.controller.getPosition());
  }
}
