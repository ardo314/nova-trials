import {
  AssetContainer,
  LoadAssetContainerAsync,
  Scene,
  TransformNode,
} from "@babylonjs/core";

export class LobbyLevel {
  private container: AssetContainer | null = null;

  constructor(private scene: Scene) {}

  async load() {
    console.log("[Nova Trials]", "Loading lobby level");

    this.container = await LoadAssetContainerAsync(
      "http://localhost:3000/spawn-room.glb",
      this.scene
    );
    this.container.addAllToScene();
  }

  dispose() {
    this.container?.removeAllFromScene();
    this.container?.dispose();
  }

  get spawns(): TransformNode[] {
    const node = this.container?.rootNodes
      .flatMap(
        (node) => node.getChildren((node) => node instanceof TransformNode),
        true
      )
      .find((node) => node.name.startsWith("Spawns"));

    return node?.getChildTransformNodes(true) ?? [];
  }
}
