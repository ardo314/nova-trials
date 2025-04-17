import { Quaternion, TransformNode, Vector3 } from "@babylonjs/core";

export class CharacterRotation {
  private _yaw: number = 0;
  private _pitch: number = 0;

  constructor(
    private readonly body: TransformNode,
    private readonly head: TransformNode
  ) {}

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
    this._pitch = value;

    Quaternion.RotationAxisToRef(
      Vector3.Right(),
      value,
      this.head.rotationQuaternion!
    );
  }
}
