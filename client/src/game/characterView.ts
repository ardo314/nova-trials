import {
  IDisposable,
  Mesh,
  MeshBuilder,
  Scene,
  TransformNode,
} from "@babylonjs/core";

export class CharacterView implements IDisposable {
  readonly node: TransformNode;
  private readonly mesh: Mesh;

  constructor(scene: Scene) {
    this.node = new TransformNode("characterView", scene);
    this.mesh = MeshBuilder.CreateBox(
      "box",
      { height: 2, width: 1, depth: 1 },
      scene
    );
    this.mesh.setParent(this.node);
    this.mesh.position.y = 1;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
