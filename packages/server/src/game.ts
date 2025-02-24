import { Client, Room } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { IGameState } from "@nova-trials/shared";

export class GameState extends Schema implements IGameState {
  @type("string") mySynchronizedProperty: string = "Hello world";
}

export class Game extends Room<GameState> {
  state = new GameState();

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.allowReconnection(client, "manual");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
