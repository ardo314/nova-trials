import { Quaternion, Scene, Vector3 } from "@babylonjs/core";
import { Pose } from "@nova-trials/shared";

export type LobbyRoom = {
  spawns: Pose[];
};

export async function createLobbyRoom(): Promise<LobbyRoom> {
  console.log("[Nova Trials]", "Loading lobby level");

  return {
    spawns: [new Pose(new Vector3(0, -1, 40), Quaternion.Identity())],
  };
}
