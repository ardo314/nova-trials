import {
  HavokPlugin,
  PhysicsRaycastResult,
  TransformNode,
} from "@babylonjs/core";
import { CharacterTarget } from "./character-target";
import { IUpdate, update, isTargetable } from "@nova-trials/shared";

const MAX_RANGE = 2;

export class CharacterTargetSystem implements IUpdate {
  private raycastResult = new PhysicsRaycastResult();

  constructor(
    private readonly physics: HavokPlugin,
    private readonly head: TransformNode,
    private readonly target: CharacterTarget
  ) {}

  [update]() {
    const start = this.head.absolutePosition;
    const end = start.add(this.head.forward.scale(MAX_RANGE));

    this.physics.raycast(start, end, this.raycastResult);
    if (!this.raycastResult.hasHit) {
      this.target.value = null;
      return;
    }

    const node = this.raycastResult.body?.transformNode;
    const object = node?.metadata;
    if (!isTargetable(object)) {
      this.target.value = null;
      return;
    }

    this.target.value = object;
  }
}
