import { Scene } from "@babylonjs/core";
import { Level } from "./level";
import { RedLightGreenLightLevel } from "./red-light-green-light-level";

export * from "./level";
export * from "./red-light-green-light-level";

export type LevelName = "red-light-green-light";

export function createLevel(name: LevelName, scene: Scene): Level {
  switch (name) {
    case "red-light-green-light":
      return new RedLightGreenLightLevel(scene);
    default:
      throw new Error(`Unknown level: ${name}`);
  }
}
