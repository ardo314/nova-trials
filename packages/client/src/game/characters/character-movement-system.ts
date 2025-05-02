import {
  AbstractEngine,
  CharacterSupportedState,
  float,
  PhysicsCharacterController,
  Vector3,
} from "@babylonjs/core";
import { CharacterInput } from "./character-input";
import { CharacterKinematic } from "./character-kinematic";
import { IUpdate, update } from "@nova-trials/shared";
import { CharacterVelocity } from "./character-velocity";

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
    private readonly characterVelocity: CharacterVelocity,
    private readonly characterController: PhysicsCharacterController,
    private readonly characterInput: CharacterInput
  ) {}

  private accelerateRef(
    wishdir: Vector3,
    wishspeed: float,
    accel: float,
    dt: float,
    velocityRef: Vector3
  ) {
    var currentspeed = Vector3.Dot(velocityRef, wishdir);

    var addspeed = wishspeed - currentspeed;
    if (addspeed <= 0) return;

    var accelspeed = accel * dt * wishspeed;
    if (accelspeed > addspeed) accelspeed = addspeed;

    velocityRef.x += accelspeed * wishdir.x;
    velocityRef.z += accelspeed * wishdir.z;
  }

  private airAccelerate(Transform t, ref CharacterVelocity cv, in CharacterInput ci, float dt) {
      var wishdir = InputToVector(ci);
      wishdir = t.TransformDirection(wishdir);

      var wishspeed = length(wishdir) * MOVE_SPEED;

      if (wishspeed > 0)
          wishdir = normalize(wishdir);

      float accel;
      if (dot(cv.Value, wishdir) < 0)
          accel = AIR_DECCELERATION;
      else
          accel = AIR_ACCELERATION;

      var wishspeed2 = wishspeed;
      if (!ci.Forward && !ci.Backward && (ci.Left || ci.Right))
      {
          if (wishspeed > SIDE_STRAFE_SPEED)
              wishspeed = SIDE_STRAFE_SPEED;
          accel = SIDE_STRAFE_ACCELERATION;
      }

      this.accelerateRef(wishdir, wishspeed, accel, dt, ref cv.Value);

      if (AIR_CONTROL > 0)
          AirControl(in ci, wishdir, wishspeed2, dt, ref cv.Value);

      cv.Value.y -= GRAVITY * dt;
  }

  private airControl(in CharacterInput i, wishdir: Vector3, wishspeed: float, dt: float, velocityRef: Vector3)
  {
      if (!i.Forward && !i.Backward || Mathf.Abs(wishspeed) < 0.001)
          return;

      var zspeed = velocityRef.y;
      velocityRef.y = 0;

      var speed = length(velocityRef);
      velocityRef = normalize(velocityRef);

      var d = dot(velocityRef, wishdir);
      var k = 32f;
      k *= AIR_CONTROL * d * d * dt;

      if (d > 0)
      {
        velocityRef.x = velocityRef.x * speed + wishdir.x * k;
        velocityRef.y = velocityRef.y * speed + wishdir.y * k;
        velocityRef.z = velocityRef.z * speed + wishdir.z * k;

        velocityRef = normalize(velocityRef);
      }

      velocityRef.x *= speed;
      velocityRef.y = zspeed;
      velocityRef.z *= speed;
  }
  
  private groundAccelerate(Transform t, ref CharacterVelocity cv, in CharacterInput ci, float dt) {
    if (!ci.Jump)
        ApplyFriction(1.0f, dt, ref cv.Value);
    else
        ApplyFriction(0, dt, ref cv.Value);

    var wishdir = InputToVector(ci);
    wishdir = t.TransformDirection(wishdir);

    if (length(wishdir) > 0)
        wishdir = normalize(wishdir);

    var wishspeed = length(wishdir) * MOVE_SPEED;

    Accelerate(wishdir, wishspeed, RUN_ACCELERATION, dt, ref cv.Value);

    // Reset the gravity velocity
    cv.Value.y -= GRAVITY * dt;

    if (ci.Jump)
    {
        cv.Value.y = JUMP_SPEED;
        //wishJump = false;
    }
  }

  private applyFriction(t: float, dt: float, velocity: Vector3)
  {
      var vec = velocity;
      vec.y = 0.0f;

      var speed = length(vec);

      var control = speed < RUN_DECCELERATION ? RUN_DECCELERATION : speed;
      var drop = control * GROUND_FRICTION * dt * t;

      var newspeed = speed - drop;

      if (newspeed < 0)
          newspeed = 0;
      if (speed > 0)
          newspeed /= speed;

      velocity.x *= newspeed;
      velocity.z *= newspeed;
  }

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
