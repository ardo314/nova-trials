import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  IDisposable,
  IKeyboardEvent,
  Observable,
  Observer,
  Scene,
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
} from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { SpawnRoom, Level } from "@nova-trials/shared";
import { Character } from "./characters/character";
import { Input } from "./input";
import { FpsCamera } from "./fps-camera";
import "@babylonjs/loaders";
import { Inspector } from "@babylonjs/inspector";
import { LocalCharacter } from "./characters/local-character";
import { RemoteCharacter } from "./characters/remote-character";

const SERVER_HOST = "http://localhost:2567";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly input: Input;
  private readonly keyboardInputObserver: Observer<IKeyboardEvent>;
  private readonly client: Client;
  private readonly cammera: FpsCamera;
  private readonly characters: Record<string, Character> = {};
  private physicsEngine: HavokPlugin | null = null;
  private room: Room<GameState> | null = null;
  readonly scene: Scene;
  readonly spawnRoom: SpawnRoom;
  level: Level | null = null;

  private _isPaused: boolean = false;

  readonly onIsPausedChanged: Observable<void> = new Observable<void>();

  get isPaused(): boolean {
    return this._isPaused;
  }

  set isPaused(value: boolean) {
    this._isPaused = value;
    this.onIsPausedChanged.notifyObservers();
  }

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.engine.runRenderLoop(this.update.bind(this));

    this.scene = new Scene(this.engine);
    this.spawnRoom = new SpawnRoom(this.scene);
    this.cammera = new FpsCamera(this.scene);

    this.deviceSourceManager = new DeviceSourceManager(this.engine);
    this.input = new Input(this.deviceSourceManager);
    this.client = new Client(SERVER_HOST);

    window.addEventListener("resize", this.onWindowResize);

    this.keyboardInputObserver = this.input.onKeyboardInput.add(
      this.onKeyboardInputChanged.bind(this)
    );
  }

  dispose() {
    console.log("[Nova Trials]", "Disposing game");

    this.engine.dispose();
    this.deviceSourceManager.dispose();
    this.input.dispose();
    this.keyboardInputObserver.remove();
    this.physicsEngine?.dispose();
    this.room?.leave();
    this.room?.removeAllListeners();

    window.removeEventListener("resize", this.onWindowResize);
  }

  async start() {
    console.log("[Nova Trials]", "Starting game");

    await this.loadHavokPhysics();
    await this.join();
    await this.spawnRoom.load();
  }

  private update() {
    for (const character of Object.values(this.characters)) {
      character.update();
    }

    this.cammera.update();
    this.scene.render();
  }

  private onKeyboardInputChanged(ev: IKeyboardEvent) {
    if (ev.type !== "keydown") {
      return;
    }

    switch (ev.key) {
      case "Escape":
        this.isPaused = !this.isPaused;
        break;
    }
  }

  private onCharacterAdd(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character added", state.name, index);

    if (this.room === null) {
      console.error("[Nova Trials]", "Room is null");
      return;
    }

    if (this.physicsEngine === null) {
      console.error("[Nova Trials]", "HavokEngine is null");
      return;
    }

    if (index === this.room.sessionId) {
      const character = new LocalCharacter(
        this.physicsEngine,
        this.scene,
        this.input,
        this.room,
        state
      );
      this.characters[index] = character;
      this.cammera.target = character.kinematic.head;
    } else {
      const character = new RemoteCharacter(this.scene, this.room, state);
      this.characters[index] = character;
    }
  }

  private onCharacterRemove(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character removed", state.name, index);

    this.characters[index].dispose();
    delete this.characters[index];
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

    this.physicsEngine = new HavokPlugin(true, await HavokPhysics());
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), this.physicsEngine);
  }

  private onWindowResize = () => {
    console.log("[Nova Trials]", "Resizing renderer");

    this.engine.resize();
  };

  toggleInspector(globalRoot: HTMLElement) {
    if (!Inspector.IsVisible) {
      Inspector.Show(this.scene, {
        globalRoot,
      });
    } else {
      Inspector.Hide();
    }
  }

  get localCharacter() {
    if (!this.room) {
      return undefined;
    }
    return this.characters[this.room.sessionId];
  }
}
