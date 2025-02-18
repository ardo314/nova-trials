import { Engine, Scene } from "@babylonjs/core";
import { Character } from "./character";
import { Player } from "./player";
import { Trial } from "./trials/trial";
import { RedLightGreenLightTrial } from "./trials/red-light-green-light";

export class Game {
  private scene: Scene;
  private trials: Trial[];
  private characters: Character[] = [];

  private currentTrial: Trial | null = null;

  constructor(private engine: Engine) {
    this.scene = new Scene(engine);

    this.trials = [new RedLightGreenLightTrial(this)];
  }

  update() {
    if (this.currentTrial) {
      this.currentTrial.update();
    }
  }

  onPlayerJoined(player: Player) {
    this.createCharacter(player);
  }

  onPlayerLeft(player: Player) {
    this.destroyCharacter(player);
  }

  startTrial(trial: Trial) {}

  eliminate(character: Character) {}

  private createCharacter(player: Player) {
    const character = new Character(this.scene);
    this.characters.push(character);
    return character;
  }

  private destroyCharacter(player: Player) {}

  getCharacters() {
    return this.characters;
  }
}
