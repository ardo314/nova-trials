import {
  IDisposable,
  Mesh,
  MeshBuilder,
  Scene,
  TransformNode,
} from "@babylonjs/core";
import { Character } from ".";

export class CharacterView implements IDisposable {
  private readonly node: TransformNode;
  private readonly mesh: Mesh;

  constructor(private character: Character, scene: Scene) {
    this.node = new TransformNode("characterView", scene);
    this.mesh = MeshBuilder.CreateBox(
      "box",
      { height: 2, width: 1, depth: 1 },
      scene
    );
    this.mesh.setParent(this.node);
    this.mesh.position.y = 1;
  }

  update() {
    this.node.position.copyFrom(this.character.node.position);
    this.node.rotation.copyFrom(this.character.node.rotation);
  }

  dispose() {
    this.node.dispose();
    this.mesh.dispose();
  }
}
