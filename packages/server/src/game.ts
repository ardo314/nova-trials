import { Client, Room } from "colyseus";
import {
  CharacterState,
  DEFAULT_CHARACTER_NAME,
  GameState,
  JoinOptions,
  SetTransform,
  SpawnRoom,
} from "@nova-trials/shared";
import { Engine, NullEngine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class Game extends Room<GameState> {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private spawnRoom: SpawnRoom;

  state = new GameState();

  constructor() {
    super();

    this.engine = new NullEngine();
    this.scene = new Scene(this.engine);
    this.spawnRoom = new SpawnRoom(this.scene);
  }

  async onCreate(options: any) {
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
