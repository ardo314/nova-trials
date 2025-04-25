import {
  PhysicsBody,
  PhysicsCharacterController,
  PhysicsMotionType,
  PhysicsShapeCapsule,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

const HEIGHT = 1.8;
const RADIUS = 0.5;

export function getCharacterPhysicsShape(scene: Scene) {
  return scene.getOrAddExternalDataWithFactory(
    "characterPhysicsShape",
    () =>
      new PhysicsShapeCapsule(
        new Vector3(0, 0, 0),
        new Vector3(0, HEIGHT, 0),
        RADIUS,
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
    position,
    { capsuleHeight: HEIGHT, capsuleRadius: RADIUS },
    scene
  );
}
