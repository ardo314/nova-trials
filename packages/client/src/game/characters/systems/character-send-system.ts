import { AbstractEngine } from "@babylonjs/core";
import { SEND_DELTA_TIME, SetTransform } from "@nova-trials/shared";
import { Room } from "colyseus.js";
import { CharacterPosition } from "../types/character-position";
import { CharacterYaw } from "../types/character-yaw";
import { CharacterPitch } from "../types/character-pitch";

export class CharacterSendSystem {
  private sendTime = 0;

  constructor(
    private readonly engine: AbstractEngine,
    private readonly room: Room,
    private readonly character: CharacterPosition &
      CharacterYaw &
      CharacterPitch
  ) {}

  execute() {
    this.sendTime += this.engine.getDeltaTime();
    if (this.sendTime >= SEND_DELTA_TIME) {
      const position = this.character.position;
      const message: SetTransform.Message = {
        x: position.x,
        y: position.y,
        z: position.z,
        yaw: this.character.yaw,
        pitch: this.character.pitch,
      };

      this.room.send(SetTransform.Type, message);
      this.sendTime -= SEND_DELTA_TIME;
    }
  }
}
