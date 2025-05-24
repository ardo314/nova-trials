import { isInteractable, IUpdate, update } from "@nova-trials/shared";
import { CharacterInput } from "./character-input";
import { CharacterTarget } from "./character-target";

export class CharacterInteractionSystem implements IUpdate {
  constructor(
    private readonly target: CharacterTarget,
    private readonly input: CharacterInput
  ) {}

  [update]() {
    if (!this.input.interact) {
      return;
    }

    if (!isInteractable(this.target.value)) {
      return;
    }

    // Do something
  }
}
