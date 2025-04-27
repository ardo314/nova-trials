import { IUpdateable, update } from "@nova-trials/shared";
import { CharacterInput } from "../types/character-input";
import { CharacterTarget } from "./character-target";

export class CharacterInteractionSystem implements IUpdateable {
  constructor(
    private readonly target: CharacterTarget,
    private readonly input: CharacterInput
  ) {}

  [update]() {
    if (!this.target.interactable) {
      return;
    }

    if (!this.input.interact) {
      return;
    }

    // Do something
  }
}
