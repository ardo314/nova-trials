import {
  AbstractEngine,
  CharacterSupportedState,
  float,
  PhysicsCharacterController,
  Vector3,
} from "@babylonjs/core";
import { CharacterInput } from "./character-input";
import { CharacterKinematic } from "./character-kinematic";
import { CHARACTER_CENTER, IUpdate, update } from "@nova-trials/shared";

const GRAVITY_Y = -20.0;
const GRAVITY = new Vector3(0, GRAVITY_Y, 0);
const GROUND_FRICTION = 6;
const AIR_ACCELERATION = 2.0;
const AIR_DECCELERATION = 2.0;
const SIDE_STRAFE_ACCELERATION = 50.0;
const SIDE_STRAFE_SPEED = 1.0;
const AIR_CONTROL = 0.3;
const RUN_ACCELERATION = 14.0;
const RUN_DECCELERATION = 10.0;
const JUMP_SPEED = 8.0;
const MOVE_SPEED = 7.0;

export class CharacterMovementSystem implements IUpdate {
  constructor(
    private readonly engine: AbstractEngine,
    private readonly kinematic: CharacterKinematic,
    private readonly velocity: Vector3,
    private readonly input: CharacterInput,
    private readonly characterController: PhysicsCharacterController
  ) {}

  private inputToVector() {
    return new Vector3(this.input.right, 0, this.input.forward);
  }

  private applyAcceleration(
    wishdir: Vector3,
    wishspeed: float,
    accel: float,
    dt: float
  ) {
    const currentspeed = Vector3.Dot(this.velocity, wishdir);

    const addspeed = wishspeed - currentspeed;
    if (addspeed <= 0) {
      return;
    }

    let accelspeed = accel * dt * wishspeed;
    if (accelspeed > addspeed) {
      accelspeed = addspeed;
    }

    this.velocity.x += accelspeed * wishdir.x;
    this.velocity.z += accelspeed * wishdir.z;
  }

  private airControl(wishdir: Vector3, wishspeed: float, dt: float) {
    if (this.input.forward === 0 || Math.abs(wishspeed) < 0.001) {
      return;
    }

    const zspeed = this.velocity.y;
    this.velocity.y = 0;

    const speed = this.velocity.length();
    this.velocity.normalize();

    const d = Vector3.Dot(this.velocity, wishdir);
    const k = 32 * AIR_CONTROL * d * d * dt;

    if (d > 0) {
      this.velocity.x = this.velocity.x * speed + wishdir.x * k;
      this.velocity.y = this.velocity.y * speed + wishdir.y * k;
      this.velocity.z = this.velocity.z * speed + wishdir.z * k;

      this.velocity.normalize();
    }

    this.velocity.x *= speed;
    this.velocity.y = zspeed;
    this.velocity.z *= speed;
  }

  private airAccelerate(dt: float) {
    const wishdir = this.inputToVector();
    this.kinematic.body.getDirectionToRef(wishdir, wishdir);

    let wishspeed = wishdir.length() * MOVE_SPEED;

    if (wishspeed > 0) {
      wishdir.normalize();
    }

    let accel = 0;
    if (Vector3.Dot(this.velocity, wishdir) < 0) {
      accel = AIR_DECCELERATION;
    } else {
      accel = AIR_ACCELERATION;
    }

    let wishspeed2 = wishspeed;
    if (this.input.forward === 0 && this.input.right !== 0) {
      if (wishspeed > SIDE_STRAFE_SPEED) {
        wishspeed = SIDE_STRAFE_SPEED;
      }
      accel = SIDE_STRAFE_ACCELERATION;
    }

    this.applyAcceleration(wishdir, wishspeed, accel, dt);

    if (AIR_CONTROL > 0) {
      this.airControl(wishdir, wishspeed2, dt);
    }

    this.velocity.y += GRAVITY_Y * dt;
  }

  private applyFriction(t: float, dt: float) {
    const vec = this.velocity.clone();
    vec.y = 0;

    const speed = vec.length();

    const control = speed < RUN_DECCELERATION ? RUN_DECCELERATION : speed;
    const drop = control * GROUND_FRICTION * dt * t;

    let newspeed = speed - drop;

    if (newspeed < 0) {
      newspeed = 0;
    }
    if (speed > 0) {
      newspeed /= speed;
    }

    this.velocity.x *= newspeed;
    this.velocity.z *= newspeed;
  }

  private groundAccelerate(dt: float) {
    if (!this.input.jump) {
      this.applyFriction(1.0, dt);
    } else {
      this.applyFriction(0, dt);
    }

    const wishdir = this.inputToVector();
    this.kinematic.body.getDirectionToRef(wishdir, wishdir);

    if (wishdir.length() > 0) {
      wishdir.normalize();
    }

    let wishspeed = wishdir.length() * MOVE_SPEED;

    this.applyAcceleration(wishdir, wishspeed, RUN_ACCELERATION, dt);

    // Reset the gravity velocity
    this.velocity.y = GRAVITY_Y * dt;

    if (this.input.jump) {
      this.velocity.y = JUMP_SPEED;
      //wishJump = false;
    }
  }

  [update]() {
    const dt = this.engine.getDeltaTime() / 1000;

    this.kinematic.yaw += this.input.yaw;
    this.kinematic.pitch += this.input.pitch;

    const support = this.characterController.checkSupport(dt, GRAVITY);

    if (
      support.supportedState === CharacterSupportedState.SUPPORTED ||
      support.supportedState === CharacterSupportedState.SLIDING
    ) {
      this.groundAccelerate(dt);
    } else {
      this.airAccelerate(dt);
    }

    this.characterController.setVelocity(this.velocity);
    this.characterController.integrate(dt, support, GRAVITY);

    this.kinematic.position
      .copyFrom(this.characterController.getPosition())
      .subtractInPlace(CHARACTER_CENTER);
  }
}
