import { Character } from "./character";
import { Player } from "./player";
import { Trial } from "./trials/trial";

export class Game {
  private characters: Character[] = [];

  update() {}

  onPlayerJoined(player: Player) {}

  onPlayerLeft(player: Player) {}

  startTrial(trial: Trial) {}

  eliminate(character: Character) {}

  getCharacters() {
    return this.characters;
  }
}
