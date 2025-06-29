import { HavokPlugin, IDisposable, Scene, Vector3 } from "@babylonjs/core";
import { CharacterTarget } from "./character-target";
import { Input } from "../input";
import { CharacterKinematic } from "./character-kinematic";
import { CharacterInputSystem } from "./character-input-system";
import { CharacterInteractionSystem } from "./character-interaction-system";
import { CharacterMovementSystem } from "./character-movement-system";
import { CharacterSendSystem } from "./character-send-system";
import { CharacterTargetSystem } from "./character-target-system";
import { getCharacterController } from "./character-physics";
import { CharacterInput } from "./character-input";
import { getStateCallbacks, Room } from "colyseus.js";
import { CharacterState, Entity } from "@nova-trials/shared";
import { CharacterView } from "./character-view";
import { CharacterViewSyncSystem } from "./character-view-sync-system";

export type LocalCharacter = IDisposable & {
  kinematic: CharacterKinematic;
  target: CharacterTarget;
};

export function createLocalCharacter(
  physicsEngine: HavokPlugin,
  scene: Scene,
  input: Input,
  room: Room,
  state: CharacterState
): LocalCharacter {
  const entity = new Entity();
  const kinematic = entity.add(new CharacterKinematic(scene));
  kinematic.position.x = state.position.x;
  kinematic.position.y = state.position.y;
  kinematic.position.z = state.position.z;
  kinematic.yaw = state.rotation.yaw;
  kinematic.pitch = state.rotation.pitch;

  const characterController = getCharacterController(
    scene,
    kinematic.body.position
  );

  const characterInput: CharacterInput = {
    forward: 0,
    right: 0,
    jump: false,
    yaw: 0,
    pitch: 0,
    interact: false,
  };
  const velocity = new Vector3(0, 0, 0);
  const target = new CharacterTarget();
  const engine = scene.getEngine();

  entity.add(new CharacterInputSystem(input, characterInput));
  entity.add(
    new CharacterMovementSystem(
      engine,
      kinematic,
      velocity,
      characterInput,
      characterController
    )
  );
  entity.add(new CharacterTargetSystem(physicsEngine, kinematic.head, target));
  entity.add(new CharacterInteractionSystem(target, characterInput));
  entity.add(new CharacterSendSystem(engine, room, kinematic));

  const character: LocalCharacter = {
    kinematic,
    target,
    dispose: () => entity.dispose(),
  };
  kinematic.body.metadata = character;
  kinematic.head.metadata = character;

  return character;
}

export type RemoteCharacter = IDisposable & {};

export function createRemoteCharacter(
  scene: Scene,
  room: Room,
  state: CharacterState
): RemoteCharacter {
  const entity = new Entity();
  const view = entity.add(new CharacterView(scene));
  //const physicsBody = entity.add(getCharacterPhysicsBody(scene, view.body));
  entity.add(new CharacterViewSyncSystem(view, state, getStateCallbacks(room)));

  const character: RemoteCharacter = {
    dispose: () => entity.dispose(),
  };
  view.body.metadata = character;

  return character;
}
