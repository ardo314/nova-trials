import {
  IDisposable,
  Quaternion,
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import { Entity, ILateUpdate, lateUpdate } from "@nova-trials/shared";

export type FpsCamera = IDisposable & {
  target: TransformNode | null;
};

class Target {
  value: TransformNode | null = null;
}

class FollowSystem implements ILateUpdate {
  constructor(
    private readonly camera: UniversalCamera,
    private readonly target: Target
  ) {}

  [lateUpdate]() {
    if (!this.target.value) {
      return;
    }

    this.camera.position.copyFrom(this.target.value.getAbsolutePosition());
    this.camera.rotationQuaternion.copyFrom(
      this.target.value.absoluteRotationQuaternion
    );
  }
}

export function createFpsCamera(scene: Scene): FpsCamera {
  const entity = new Entity();
  const camera = entity.add(
    new UniversalCamera("camera", new Vector3(0, 0, 0), scene)
  );
  camera.rotationQuaternion = Quaternion.Identity();

  const target: Target = new Target();
  entity.add(new FollowSystem(camera, target));

  const fpsCamera: FpsCamera = {
    get target() {
      return target.value;
    },
    set target(value: TransformNode | null) {
      target.value = value;
    },
    dispose: () => entity.dispose(),
  };
  camera.metadata = fpsCamera;

  return fpsCamera;
}
