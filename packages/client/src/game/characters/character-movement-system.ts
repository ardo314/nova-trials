import {
  AbstractEngine,
  CharacterSupportedState,
  float,
  PhysicsCharacterController,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { CharacterInput } from "./character-input";
import { CharacterKinematic } from "./character-kinematic";
import { IUpdate, update } from "@nova-trials/shared";

const GRAVITY = 20.0;
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
    var wishdir = InputToVector(ci);
    wishdir = this.kinematic.body.TransformDirection(wishdir);

    var wishspeed = length(wishdir) * MOVE_SPEED;

    if (wishspeed > 0) {
      wishdir = normalize(wishdir);
    }

    let accel = 0;
    if (Vector3.Dot(this.velocity, wishdir) < 0) {
      accel = AIR_DECCELERATION;
    } else {
      accel = AIR_ACCELERATION;
    }

    var wishspeed2 = wishspeed;
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

    this.velocity.y -= GRAVITY * dt;
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

    var wishdir = InputToVector(ci);
    wishdir = this.kinematic.body.TransformDirection(wishdir);

    if (length(wishdir) > 0) {
      wishdir = normalize(wishdir);
    }

    var wishspeed = length(wishdir) * MOVE_SPEED;

    this.applyAcceleration(wishdir, wishspeed, RUN_ACCELERATION, dt);

    // Reset the gravity velocity
    this.velocity.y -= GRAVITY * dt;

    if (this.input.jump) {
      this.velocity.y = JUMP_SPEED;
      //wishJump = false;
    }
  }

  [update]() {
    const dt = this.engine.getDeltaTime() / 1000;

    this.kinematic.yaw += this.input.yaw;
    this.kinematic.pitch += this.input.pitch;

    this.velocity.set(0, 0, 0);
    this.kinematic.body.forward.scaleAndAddToRef(
      this.input.forward,
      this.velocity
    );
    this.kinematic.body.right.scaleAndAddToRef(this.input.right, this.velocity);
    this.velocity.normalize();
    this.velocity.scaleInPlace(SPEED);

    const support = this.characterController.checkSupport(dt, GRAVITY);

    if (support.supportedState === CharacterSupportedState.UNSUPPORTED) {
      this.velocity.y = GRAVITY.y;
    }

    this.characterController.setVelocity(this.velocity);
    this.characterController.integrate(dt, support, GRAVITY);

    this.kinematic.position.copyFrom(this.characterController.getPosition());
  }
}
