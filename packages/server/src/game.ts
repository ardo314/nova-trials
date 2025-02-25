import { Client, Room } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { CharacterState, GameState, SetTransform } from "@nova-trials/shared";
import { on } from "events";

export class Game extends Room<GameState> {
  state = new GameState();

  onCreate(options: any): void | Promise<any> {
    console.log("room created!");

    this.onMessage(SetTransform.Type, this.onSetTransform.bind(this));
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    this.state.characters.set(client.sessionId, new CharacterState());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.characters.delete(client.sessionId);
    this.allowReconnection(client, "manual");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  private onSetTransform(client: Client, message: SetTransform.Message) {
    const character = this.state.characters.get(client.sessionId);
    if (character) {
      character.position.x = message.x;
      character.position.y = message.y;
      character.position.z = message.z;
    }
  }
}
