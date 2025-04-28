import { Quaternion, Scene, Vector3 } from "@babylonjs/core";
import { Pose } from "@nova-trials/shared";

export type LobbyRoom = {
  spawns: Pose[];
};

export async function createLobbyRoom(scene: Scene): Promise<LobbyRoom> {
  console.log("[Nova Trials]", "Loading lobby level");

  return {
    spawns: [new Pose(Vector3.Zero(), Quaternion.Identity())],
  };
}
