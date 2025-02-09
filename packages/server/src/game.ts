import { Character } from "./character";
import { Trial } from "./trials/trial";

export class Game {
  private characters: Character[] = [];

  update() {}

  setTrial(trial: Trial) {}

  elimnate(character: Character) {}

  getCharacters() {
    return this.characters;
  }
}
