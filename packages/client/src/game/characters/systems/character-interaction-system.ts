import { CharacterInput } from "../components/character-input";
import { CharacterTarget } from "../components/character-target";

export class CharacterInteractionSystem {
  constructor(
    private readonly target: CharacterTarget,
    private readonly input: CharacterInput
  ) {}

  execute() {}
}
