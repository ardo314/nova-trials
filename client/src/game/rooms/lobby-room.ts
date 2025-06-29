import {
  IDisposable,
  LoadAssetContainerAsync,
  Mesh,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeMesh,
  Quaternion,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { Pose } from "@nova-trials/shared";
import { attachWorldButton } from "../world-button";
import { withServerHost } from "../../utils";

export type LobbyRoom = IDisposable & {};

async function loadLobby(scene: Scene) {
  console.log("[Nova Trials]", "Loading lobby");

  const container = await LoadAssetContainerAsync(
    withServerHost("lobby-room.glb"),
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

async function loadDoor(scene: Scene, pose: Pose) {
  console.log("[Nova Trials]", "Loading door");
  const container = await LoadAssetContainerAsync(
    withServerHost("door.glb"),
    scene
  );
  container.addAllToScene();

  const door = container.meshes.find((mesh) => mesh.name === "door");
  door?.position.copyFrom(pose.position);
  door?.rotationQuaternion?.copyFrom(pose.rotation);

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

async function loadReadyButton(scene: Scene, pose: Pose) {
  console.log("[Nova Trials]", "Loading ready button");

  const container = await LoadAssetContainerAsync(
    withServerHost("ready-button.glb"),
    scene
  );
  container.addAllToScene();

  const base = container.meshes.find((mesh) => mesh.name === "base");
  base?.position.copyFrom(pose.position);
  base?.rotationQuaternion?.copyFrom(pose.rotation);

  container.meshes.forEach((mesh) => {
    if (!(mesh instanceof Mesh)) {
      return;
    }

    if (mesh.name === "button") {
      attachWorldButton(mesh);
    }

    const shape = new PhysicsShapeMesh(mesh, scene);
    const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
    body.shape = shape;
  });

  return container;
}

export async function createLobbyRoom(scene: Scene): Promise<LobbyRoom> {
  console.log("[Nova Trials]", "Creating lobby room");

  const assets = await Promise.all([
    loadLobby(scene),
    loadDoor(scene, new Pose(new Vector3(0, 0, 0.5), Quaternion.Identity())),
    loadReadyButton(
      scene,
      new Pose(new Vector3(0, -1, 24), Quaternion.Identity())
    ),
  ]);

  return {
    dispose: () => {
      assets.forEach((asset) => {
        asset.removeAllFromScene();
        asset.dispose();
      });
    },
  };
}
