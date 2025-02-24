import { Client, Room } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { GameState } from "@nova-trials/shared";

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
