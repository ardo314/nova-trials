import { Quaternion, Vector3 } from "@babylonjs/core";

export class Pose {
  constructor(readonly position: Vector3, readonly rotation: Quaternion) {}
}
