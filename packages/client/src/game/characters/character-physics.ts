import {
  PhysicsBody,
  PhysicsCharacterController,
  PhysicsMotionType,
  PhysicsShapeCapsule,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import {
  CHARACTER_CENTER,
  CHARACTER_HEIGHT,
  CHARACTER_RADIUS,
} from "@nova-trials/shared";

export function getCharacterPhysicsShape(scene: Scene) {
  return scene.getOrAddExternalDataWithFactory(
    "characterPhysicsShape",
    () =>
      new PhysicsShapeCapsule(
        new Vector3(0, 0, 0),
        new Vector3(0, CHARACTER_HEIGHT, 0),
        CHARACTER_RADIUS,
        scene
      )
  );
}

export function getCharacterPhysicsBody(scene: Scene, node: TransformNode) {
  const physicsBody = new PhysicsBody(
    node,
    PhysicsMotionType.ANIMATED,
    false,
    scene
  );
  physicsBody.shape = getCharacterPhysicsShape(scene);
  return physicsBody;
}

export function getCharacterController(scene: Scene, position: Vector3) {
  return new PhysicsCharacterController(
    position.add(CHARACTER_CENTER),
    { capsuleHeight: CHARACTER_HEIGHT, capsuleRadius: CHARACTER_RADIUS },
    scene
  );
}
