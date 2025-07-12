import {
  IDisposable,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { CharacterYaw } from "./character-yaw";
import { CharacterPitch } from "./character-pitch";
import { CharacterPosition } from "./character-position";
import { CHARACTER_EYE_HEIGHT } from "@nova-trials/shared";

export class CharacterKinematic
  implements CharacterPosition, CharacterYaw, CharacterPitch, IDisposable
{
  readonly body: TransformNode;
  readonly head: TransformNode;

  private _yaw: number = 0;
  private _pitch: number = 0;

  constructor(scene: Scene) {
    this.body = new TransformNode("character", scene);
    this.body.rotationQuaternion = Quaternion.Identity();

    this.head = new TransformNode("head", scene);
    this.head.setParent(this.body);
    this.head.position.y = CHARACTER_EYE_HEIGHT;
    this.head.rotationQuaternion = Quaternion.Identity();
  }

  dispose() {
    this.body.dispose();
  }

  get position(): Vector3 {
    return this.body.position;
  }

  set position(value: Vector3) {
    this.body.position.copyFrom(value);
  }

  get yaw(): number {
    return this._yaw;
  }

  set yaw(value: number) {
    this._yaw = value;

    Quaternion.RotationAxisToRef(
      Vector3.Up(),
      value,
      this.body.rotationQuaternion!
    );
  }

  get pitch(): number {
    return this._pitch;
  }

  set pitch(value: number) {
    value = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, value));

    this._pitch = value;

    Quaternion.RotationAxisToRef(
      Vector3.Right(),
      value,
      this.head.rotationQuaternion!
    );
  }
}
