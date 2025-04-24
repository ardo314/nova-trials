import { TransformNode } from "@babylonjs/core";
import { CharacterTarget } from "../components/character-target";

const MAX_RANGE = 1;

export class CharacterTargetSystem {
  constructor(
    private readonly head: TransformNode,
    private readonly target: CharacterTarget
  ) {}

  execute() {
    this.target.interactable = null;
  }
}
