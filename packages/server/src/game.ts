import { Client, Room } from "colyseus";
import {
  CharacterState,
  DEFAULT_CHARACTER_NAME,
  GameState,
  getRandomElement,
  JoinOptions,
  SetTransform,
  SetReady,
  RoomName,
} from "@nova-trials/shared";
import { Engine, NullEngine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { createLobbyRoom, LobbyRoom } from "./rooms/lobby-room";

export class Game extends Room<GameState> {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private lobbyRoom: LobbyRoom | null = null;

  state = new GameState();

  constructor() {
    super();

    this.engine = new NullEngine();
    this.scene = new Scene(this.engine);
  }

  async onCreate(options: any) {
    console.log("room created!");

    this.onMessage(SetTransform.Type, this.onSetTransform.bind(this));
    this.onMessage(SetReady.Type, this.onSetReady.bind(this));

    this.lobbyRoom = await createLobbyRoom();
    this.state.roomName = RoomName.RedLightGreenLight;
  }

  onJoin(client: Client, options: JoinOptions) {
    console.log(client.sessionId, "joined!");

    const state = new CharacterState();
    state.name = options.name ?? DEFAULT_CHARACTER_NAME;
    state.position.assign(getRandomElement(this.lobbyRoom.spawns).position);

    this.state.characters.set(client.sessionId, state);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.characters.delete(client.sessionId);
    this.allowReconnection(client, "manual");
  }

  onDispose() {
    this.engine.dispose();
    this.scene.dispose();
    console.log("room", this.roomId, "disposing...");
  }

  private onSetTransform(client: Client, message: SetTransform.Message) {
    const character = this.state.characters.get(client.sessionId);
    if (!character) {
      console.warn(
        "SetTransform",
        "Character not found for client",
        client.sessionId
      );
      return;
    }

    character.position.x = message.x;
    character.position.y = message.y;
    character.position.z = message.z;
    character.rotation.yaw = message.yaw;
    character.rotation.pitch = message.pitch;
  }

  private onSetReady(client: Client, message: SetReady.Message) {
    const character = this.state.characters.get(client.sessionId);
    if (!character) {
      console.warn(
        "SetReady",
        "Character not found for client",
        client.sessionId
      );
      return;
    }

    character.isReady = true;
  }
}
