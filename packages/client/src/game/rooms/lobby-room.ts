import { LoadAssetContainerAsync, Scene } from "@babylonjs/core";

export type LobbyRoom = {
  dispose: () => void;
};

async function loadLobby(scene: Scene) {
  console.log("[Nova Trials]", "Loading lobby level");

  const container = await LoadAssetContainerAsync(
    "http://localhost:3000/lobby-room.glb",
    scene
  );
  container.addAllToScene();
  return container;
}

async function loadReadyButton(scene: Scene) {
  console.log("[Nova Trials]", "Loading ready button");

  const container = await LoadAssetContainerAsync(
    "http://localhost:3000/ready-button.glb",
    scene
  );
  container.addAllToScene();
  return container;
}

export async function createLobbyRoom(scene: Scene): Promise<LobbyRoom> {
  console.log("[Nova Trials]", "Loading lobby level");

  const assets = await Promise.all([loadLobby(scene), loadReadyButton(scene)]);

  return {
    dispose: () => {
      assets.forEach((asset) => {
        asset.removeAllFromScene();
        asset.dispose();
      });
    },
  };
}
