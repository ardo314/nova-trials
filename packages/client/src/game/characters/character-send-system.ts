import { AbstractEngine } from "@babylonjs/core";
import {
  IUpdate,
  SEND_DELTA_TIME,
  SetTransform,
  update,
} from "@nova-trials/shared";
import { Room } from "colyseus.js";
import { CharacterKinematic } from "./character-kinematic";

export class CharacterSendSystem implements IUpdate {
  private sendTime = 0;

  constructor(
    private readonly engine: AbstractEngine,
    private readonly room: Room,
    private readonly kinematic: CharacterKinematic
  ) {}

  [update]() {
    this.sendTime += this.engine.getDeltaTime();
    if (this.sendTime >= SEND_DELTA_TIME) {
      const position = this.kinematic.position;
      const message: SetTransform.Message = {
        x: position.x,
        y: position.y,
        z: position.z,
        yaw: this.kinematic.yaw,
        pitch: this.kinematic.pitch,
      };

      this.room.send(SetTransform.Type, message);
      this.sendTime -= SEND_DELTA_TIME;
    }
  }
}
