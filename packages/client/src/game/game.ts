import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  IDisposable,
  Scene,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {
  CharacterState,
  DEFAULT_CHARACTER_NAME,
  GameState,
  JoinOptions,
  ROOM_NAME,
  SetTransform,
} from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { Character } from "./character";
import { CharacterView } from "./characterView";

const SERVER_HOST = "http://localhost:2567";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly client: Client;
  private havokPlugin: HavokPlugin | null = null;
  private room: Room<GameState> | null = null;
  private readonly characters: Record<string, Character> = {};
  scene: Scene;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.engine.runRenderLoop(this.onUpdate.bind(this));

    this.scene = new Scene(this.engine);

    this.deviceSourceManager = new DeviceSourceManager(this.engine);
    this.client = new Client(SERVER_HOST);

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  dispose(): void {
    console.log("[Nova Trials]", "Disposing game");

    this.engine.dispose();
    this.deviceSourceManager.dispose();
    this.havokPlugin?.dispose();
    this.room?.leave();
    this.room?.removeAllListeners();
  }

  async start() {
    console.log("[Nova Trials]", "Starting game");

    await this.loadHavokPhysics();
    await this.join();
  }

  private onUpdate() {
    this.scene.render();
  }

  private sendSetTransform() {
    const message: SetTransform.Message = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.room?.sendUnreliable(SetTransform.Type, message);
  }

  private onCharacterAdd(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character added", state.name, index);

    const character = new Character(this.scene);
    character.fromState(state);

    this.characters[index] = character;

    if (index !== this.room?.sessionId) {
      new CharacterView(character, this.scene);
    }
  }

  private onCharacterRemove(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character removed", state.name, index);

    this.characters[index].dispose();
    delete this.characters[index];
  }

  private onError(code: number, message?: string) {
    console.error("[Nova Trials]", "Error", code, message);
  }

  private onLeave(code: number) {
    console.log("[Nova Trials]", "Leaving room", code);
  }

  private async join() {
    console.log("[Nova Trials]", "Joining room");

    const options: JoinOptions = {
      name: DEFAULT_CHARACTER_NAME,
    };

    this.room = await this.client.joinOrCreate(ROOM_NAME, options);
    this.room.onMessage("*", (type, message) => console.log(type, message));
    this.room.onError(this.onError.bind(this));
    this.room.onLeave(this.onLeave.bind(this));

    const $ = getStateCallbacks(this.room);
    $(this.room.state).characters.onAdd(this.onCharacterAdd.bind(this));
    $(this.room.state).characters.onRemove(this.onCharacterRemove.bind(this));
  }

  private async loadHavokPhysics() {
    console.log("[Nova Trials]", "Loading Havok Physics");

    this.havokPlugin = new HavokPlugin(true, await HavokPhysics());
  }

  private onWindowResize() {
    console.log("[Nova Trials]", "Resizing renderer");

    this.engine.resize();
  }

  get localCharacter() {
    if (!this.room) {
      return undefined;
    }
    return this.characters[this.room.sessionId];
  }
}
