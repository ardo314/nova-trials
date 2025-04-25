import {
  IDisposable,
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { CharacterYawSetter } from "../types/character-yaw";
import { CharacterPosition } from "../types/character-position";

export class CharacterView
  implements CharacterPosition, CharacterYawSetter, IDisposable
{
  readonly body: TransformNode;

  constructor(scene: Scene) {
    this.body = new TransformNode("characterView", scene);
    this.body.rotationQuaternion = Quaternion.Identity();

    const mesh = MeshBuilder.CreateCapsule(
      "box",
      { height: 1.8, radius: 0.5 },
      scene
    );
    mesh.setParent(this.body);
    mesh.position.y = 0.9;
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
