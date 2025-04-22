import { AbstractEngine, TransformNode } from "@babylonjs/core";
import { SEND_DELTA_TIME, SetTransform } from "@nova-trials/shared";
import { Room } from "colyseus.js";
import { CharacterRotation } from "../components/character-rotation";

export class CharacterSendSystem {
  private sendTime = 0;

  constructor(
    private readonly engine: AbstractEngine,
    private readonly room: Room,
    private readonly body: TransformNode,
    private readonly rotation: CharacterRotation
  ) {}

  execute() {
    this.sendTime += this.engine.getDeltaTime();
    if (this.sendTime >= SEND_DELTA_TIME) {
      const position = this.body.position;
      const message: SetTransform.Message = {
        x: position.x,
        y: position.y,
        z: position.z,
        yaw: this.rotation.yaw,
        pitch: this.rotation.pitch,
      };

      this.room.send(SetTransform.Type, message);
      this.sendTime -= SEND_DELTA_TIME;
    }
  }
}
