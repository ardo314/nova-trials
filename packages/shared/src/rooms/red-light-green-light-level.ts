import {
  HemisphericLight,
  Light,
  LoadAssetContainerAsync,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { Level } from "./level";

export class RedLightGreenLightLevel extends Level {
  private light: Light | null = null;

  constructor(scene: Scene) {
    super(scene);
  }

  async load() {
    console.log("[Nova Trials]", "Loading red light green light level");

    this.container = await LoadAssetContainerAsync(
      "http://localhost:3000/red-light-green-light.glb",
      this.scene
    );
    this.container.addAllToScene();

    this.light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene
    );
  }

  dispose() {
    this.container?.removeAllFromScene();
    this.container?.dispose();
    this.light?.dispose();
  }
}
