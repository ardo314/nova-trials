import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  HemisphericLight,
  IDisposable,
  Scene,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {
  CharacterState,
  createLevel,
  DEFAULT_CHARACTER_NAME,
  GameState,
  JoinOptions,
  LevelName,
  ROOM_NAME,
  SEND_DELTA_TIME,
  SetTransform,
} from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { Character } from "./character";
import { CharacterView } from "./characterView";
import { CharacterController } from "./characterController";
import { SpawnRoom, Level, RedLightGreenLightLevel } from "@nova-trials/shared";

const SERVER_HOST = "http://localhost:2567";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly client: Client;
  private havokPlugin: HavokPlugin | null = null;
  private room: Room<GameState> | null = null;
  private readonly characters: Record<string, Character> = {};
  private readonly characterViews: Record<string, CharacterView> = {};
  private characterController: CharacterController | null = null;
  private sendTime = 0;
  readonly scene: Scene;
  readonly spawnRoom: SpawnRoom;
  level: Level | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.engine.runRenderLoop(this.onUpdate.bind(this));

    this.scene = new Scene(this.engine);
    this.spawnRoom = new SpawnRoom(this.scene);

    new UniversalCamera("camera", new Vector3(0, 2, -10), this.scene);

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
    await this.spawnRoom.load();
  }

  private onUpdate() {
    this.characterController?.update(this.engine.getDeltaTime());

    this.sendTime += this.engine.getDeltaTime();
    if (this.sendTime >= SEND_DELTA_TIME) {
      this.sendSetTransform();
      this.sendTime -= SEND_DELTA_TIME;
    }

    if (this.localCharacter) {
      this.scene.activeCamera?.position.copyFrom(
        this.localCharacter.headNode.getAbsolutePosition()
      );
    }

    for (const view of Object.values(this.characterViews)) {
      view.update();
    }

    this.scene.render();
  }

  private sendSetTransform() {
    if (!this.localCharacter) {
      return;
    }

    const position = this.localCharacter.node.position;
    const message: SetTransform.Message = {
      x: position.x,
      y: position.y,
      z: position.z,
    };

    this.room?.send(SetTransform.Type, message);
  }

  private onCharacterAdd(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character added", state.name, index);

    const character = new Character(this.scene);
    character.fromState(state);

    this.characters[index] = character;

    if (index === this.room?.sessionId) {
      this.characterController = new CharacterController(
        this.deviceSourceManager,
        character
      );
    } else {
      const $ = getStateCallbacks(this.room!);
      $(state).position.onChange(() => character.fromState(state));

      const view = new CharacterView(character, this.scene);
      this.characterViews[index] = view;
    }
  }

  private onCharacterRemove(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character removed", state.name, index);

    this.characters[index].dispose();
    delete this.characters[index];

    this.characterViews[index]?.dispose();
    delete this.characterViews[index];
  }

  private async onLevelChange(level: string) {
    this.level?.dispose();

    this.level = createLevel(level as LevelName, this.scene);
    await this.level.load();
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

    $(this.room.state).listen("level", this.onLevelChange.bind(this));
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
