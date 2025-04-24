import { TransformNode } from "@babylonjs/core";
import { CharacterTarget } from "../components/character-target";

export class CharacterTargetSystem {
  constructor(
    private readonly head: TransformNode,
    private readonly target: CharacterTarget
  ) {}

  execute() {}
}
