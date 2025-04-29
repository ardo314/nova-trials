import {
  AbstractEngine,
  CharacterSupportedState,
  PhysicsCharacterController,
  Vector3,
} from "@babylonjs/core";
import { CharacterInput } from "./character-input";
import { CharacterKinematic } from "./character-kinematic";
import { IUpdate, update } from "@nova-trials/shared";
import { CharacterVelocity } from "./character-velocity";

const SPEED = 5;
const GRAVITY = new Vector3(0, -9.81, 0);

export class CharacterMovementSystem implements IUpdate {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly kinematic: CharacterKinematic,
    private readonly characterVelocity: CharacterVelocity,
    private readonly characterController: PhysicsCharacterController,
    private readonly characterInput: CharacterInput
  ) {}

  [update]() {
    const dt = this.engine.getDeltaTime() / 1000;

    this.kinematic.yaw += this.characterInput.yaw;
    this.kinematic.pitch += this.characterInput.pitch;

    this.characterVelocity.value.set(0, 0, 0);
    this.kinematic.body.forward.scaleAndAddToRef(
      this.characterInput.forward,
      this.characterVelocity.value
    );
    this.kinematic.body.right.scaleAndAddToRef(
      this.characterInput.right,
      this.characterVelocity.value
    );
    this.characterVelocity.value.normalize();
    this.characterVelocity.value.scaleInPlace(SPEED);

    const support = this.characterController.checkSupport(dt, GRAVITY);

    if (support.supportedState === CharacterSupportedState.UNSUPPORTED) {
      this.characterVelocity.value.y = GRAVITY.y;
    }

    this.characterController.setVelocity(this.characterVelocity.value);
    this.characterController.integrate(dt, support, GRAVITY);

    this.kinematic.position.copyFrom(this.characterController.getPosition());
  }
}
