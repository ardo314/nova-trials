import { AssetContainer, Scene } from "@babylonjs/core";

export abstract class Level {
  protected container: AssetContainer | null = null;

  constructor(protected scene: Scene) {}

  abstract load(): Promise<void>;

  abstract dispose(): void;
}
