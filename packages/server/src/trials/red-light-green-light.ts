import { Quaternion, Vector3 } from "@babylonjs/core";
import { Game } from "../game";

type CharacterData = {
  position: Vector3;
  rotation: Vector3;
};

export class RedLightGreenLightTrial {
  private redLight: boolean = true;
  private timer: number = 0;
  private watchedData: CharacterData[] = [];

  constructor(private game: Game) {}

  private onEnterRedLight() {
    this.watchedData = this.game.getCharacters().map((character) => ({
      position: character.position,
      rotation: character.rotation,
    }));
  }

  private onUpdateRedLight() {}

  update() {
    if (this.timer === 0 && !this.redLight) {
      this.redLight = true;
      this.onEnterRedLight();
    }

    if (this.timer === 0 && this.redLight) {
      this.redLight = false;
    }

    if (this.redLight) {
      this.onUpdateRedLight();
    }
  }
}
