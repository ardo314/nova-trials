import {
  HavokPlugin,
  PhysicsRaycastResult,
  TransformNode,
} from "@babylonjs/core";
import { CharacterTarget } from "./character-target";
import { IUpdateable, update } from "@nova-trials/shared";

const MAX_RANGE = 1;

export class CharacterTargetSystem implements IUpdateable {
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
      this.target.interactable = null;
      return;
    }
  }
}
