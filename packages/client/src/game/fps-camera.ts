import {
  Quaternion,
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import { Actor } from "./actor";

export class FpsCamera extends Actor {
  private readonly camera: UniversalCamera;

  target: TransformNode | null = null;

  constructor(scene: Scene) {
    super();

    this.camera = new UniversalCamera("camera", new Vector3(0, 0, 0), scene);
    this.camera.rotationQuaternion = Quaternion.Identity();
  }

  dispose() {
    this.camera.dispose();
  }

  update() {
    if (!this.target) {
      return;
    }

    this.camera.position.copyFrom(this.target.getAbsolutePosition());
    this.camera.rotationQuaternion.copyFrom(
      this.target.absoluteRotationQuaternion
    );
  }
}
