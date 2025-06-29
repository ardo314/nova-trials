import {
  IDisposable,
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { CharacterYawSetter } from "./character-yaw";
import { CharacterPosition } from "./character-position";
import { CHARACTER_HEIGHT, CHARACTER_RADIUS } from "@nova-trials/shared";

export class CharacterView
  implements CharacterPosition, CharacterYawSetter, IDisposable
{
  readonly body: TransformNode;

  constructor(scene: Scene) {
    this.body = new TransformNode("characterView", scene);
    this.body.rotationQuaternion = Quaternion.Identity();

    const mesh = MeshBuilder.CreateCapsule(
      "box",
      { height: CHARACTER_HEIGHT, radius: CHARACTER_RADIUS },
      scene
    );
    mesh.setParent(this.body);
    mesh.position.y = CHARACTER_HEIGHT / 2;
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

  set yaw(value: number) {
    Quaternion.RotationAxisToRef(
      Vector3.Up(),
      value,
      this.body.rotationQuaternion!
    );
  }
}
