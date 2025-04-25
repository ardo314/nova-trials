import {
  HavokPlugin,
  PhysicsRaycastResult,
  TransformNode,
} from "@babylonjs/core";
import { CharacterTarget } from "../components/character-target";

const MAX_RANGE = 1;

export class CharacterTargetSystem {
  private raycastResult = new PhysicsRaycastResult();

  constructor(
    private readonly physics: HavokPlugin,
    private readonly head: TransformNode,
    private readonly target: CharacterTarget
  ) {}

  execute() {
    const start = this.head.absolutePosition;
    const end = start.add(this.head.forward.scale(MAX_RANGE));

    this.physics.raycast(start, end, this.raycastResult);
    if (!this.raycastResult.hasHit) {
      this.target.interactable = null;
      return;
    }
  }
}
