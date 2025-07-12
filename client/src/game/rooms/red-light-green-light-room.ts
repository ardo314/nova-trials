import {
  IDisposable,
  LoadAssetContainerAsync,
  Mesh,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeMesh,
  Scene,
} from "@babylonjs/core";
import { withServerHost } from "../../utils";

export type RedLightGreenLightRoom = IDisposable & {};

async function loadRedLightGreenLight(scene: Scene) {
  console.log("[Nova Trials]", "Loading red light green light");

  const container = await LoadAssetContainerAsync(
    withServerHost("red-light-green-light-room.glb"),
    scene
  );
  container.addAllToScene();

  container.meshes.forEach((mesh) => {
    if (!(mesh instanceof Mesh)) {
      return;
    }

    const shape = new PhysicsShapeMesh(mesh, scene);
    const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
    body.shape = shape;
  });

  return container;
}

export async function createRedLightGreenLightRoom(
  scene: Scene
): Promise<RedLightGreenLightRoom> {
  console.log("[Nova Trials]", "Creating red light green light room");

  const assets = await Promise.all([loadRedLightGreenLight(scene)]);

  return {
    dispose: () => {
      assets.forEach((asset) => {
        asset.removeAllFromScene();
        asset.dispose();
      });
    },
  };
}
