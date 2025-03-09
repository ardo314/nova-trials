import {
  AssetContainer,
  LoadAssetContainerAsync,
  Scene,
  TransformNode,
} from "@babylonjs/core";

export class SpawnRoom {
  private container: AssetContainer | null = null;

  constructor(private scene: Scene) {}

  async load() {
    console.log("[Nova Trials]", "Loading spawn room");

    this.container = await LoadAssetContainerAsync(
      "spawn-room.glb",
      this.scene
    );
    this.container.addAllToScene();
    console.log(this.container.getNodes());
  }

  unload() {
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
