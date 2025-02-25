import { Client, Room } from "colyseus";
import {
  CharacterState,
  DEFAULT_CHARACTER_NAME,
  GameState,
  JoinOptions,
  SetTransform,
} from "@nova-trials/shared";

export class Game extends Room<GameState> {
  state = new GameState();

  onCreate(options: any): void | Promise<any> {
    console.log("room created!");

    this.onMessage(SetTransform.Type, this.onSetTransform.bind(this));
  }

  onJoin(client: Client, options: JoinOptions) {
    console.log(client.sessionId, "joined!");

    const state = new CharacterState();
    state.name = options.name ?? DEFAULT_CHARACTER_NAME;

    this.state.characters.set(client.sessionId, state);
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
