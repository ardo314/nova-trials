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
  PlayerLoop,
  ROOM_NAME,
} from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { Level } from "@nova-trials/shared";
import { Input } from "./input";
import "@babylonjs/loaders";
import { Inspector } from "@babylonjs/inspector";
import { createFpsCamera, FpsCamera } from "./fps-camera";
import { createLocalCharacter, createRemoteCharacter } from "./characters";
import { createLobbyRoom, LobbyRoom } from "./rooms/lobby-room";

const SERVER_HOST = "http://localhost:2567";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly input: Input;
  private readonly keyboardInputObserver: Observer<IKeyboardEvent>;
  private readonly client: Client;
  private readonly cammera: FpsCamera;
  private readonly characters: Record<string, IDisposable> = {};
  private physicsEngine: HavokPlugin | null = null;
  private room: Room<GameState> | null = null;
  readonly scene: Scene;
  lobbyRoom: LobbyRoom | null = null;
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
    this.cammera = createFpsCamera(this.scene);

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

    this.room?.leave();
    this.room?.removeAllListeners();
    Object.values(this.characters).forEach((character) => {
      character.dispose();
    });
    this.level?.dispose();
    this.lobbyRoom?.dispose();
    this.cammera.dispose();
    this.scene.dispose();
    this.keyboardInputObserver.remove();
    this.input.dispose();
    this.deviceSourceManager.dispose();
    this.physicsEngine?.dispose();
    this.engine.dispose();

    window.removeEventListener("resize", this.onWindowResize);
  }

  async start() {
    console.log("[Nova Trials]", "Starting game");

    this.physicsEngine = await this.loadHavokPhysics();
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), this.physicsEngine);
    this.lobbyRoom = await createLobbyRoom(this.scene);
    await this.join();
  }

  private update() {
    PlayerLoop.tick();

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
      const character = createLocalCharacter(
        this.physicsEngine,
        this.scene,
        this.input,
        this.room,
        state
      );
      this.characters[index] = character;
      this.cammera.target = character.kinematic.head;
    } else {
      const character = createRemoteCharacter(this.scene, this.room, state);
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

    return new HavokPlugin(true, await HavokPhysics());
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
