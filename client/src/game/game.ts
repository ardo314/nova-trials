import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  HemisphericLight,
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
  DEFAULT_CHARACTER_NAME,
  GameState,
  JoinOptions,
  PlayerLoop,
  ROOM_NAME,
  RoomName,
} from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { Input } from "./input";
import "@babylonjs/loaders";
import { Inspector } from "@babylonjs/inspector";
import { createFpsCamera, FpsCamera } from "./fps-camera";
import {
  createLocalCharacter,
  createRemoteCharacter,
  LocalCharacter,
} from "./characters";
import { createLobbyRoom, LobbyRoom } from "./rooms/lobby-room";
import { createRedLightGreenLightRoom } from "./rooms/red-light-green-light-room";
import { getServerHost } from "../utils";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly input: Input;
  private readonly keyboardInputObserver: Observer<IKeyboardEvent>;
  private readonly client: Client;
  private readonly cammera: FpsCamera;
  private readonly characters: Record<string, IDisposable> = {};
  private physicsEngine: HavokPlugin | null = null;
  private serverRoom: Room<GameState> | null = null;
  readonly scene: Scene;
  lobbyRoom: LobbyRoom | null = null;
  room: IDisposable | null = null;

  private _isPaused: boolean = false;

  readonly onIsPausedChanged: Observable<void> = new Observable<void>();
  readonly onLocalCharacterTargetChanged: Observable<void> =
    new Observable<void>();

  get isPaused(): boolean {
    return this._isPaused;
  }

  set isPaused(value: boolean) {
    this._isPaused = value;
    this.onIsPausedChanged.notifyObservers();
  }

  get localCharacter() {
    if (!this.serverRoom) {
      return undefined;
    }
    return this.characters[this.serverRoom.sessionId] as LocalCharacter;
  }

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.engine.runRenderLoop(this.update.bind(this));

    this.scene = new Scene(this.engine);

    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    this.cammera = createFpsCamera(this.scene);

    this.deviceSourceManager = new DeviceSourceManager(this.engine);
    this.input = new Input(this.deviceSourceManager);
    this.client = new Client(getServerHost());

    window.addEventListener("resize", this.onWindowResize);

    this.keyboardInputObserver = this.input.onKeyboardInput.add(
      this.onKeyboardInputChanged.bind(this)
    );
  }

  dispose() {
    console.log("[Nova Trials]", "Disposing game");

    this.serverRoom?.leave();
    this.serverRoom?.removeAllListeners();
    Object.values(this.characters).forEach((character) => {
      character.dispose();
    });
    this.room?.dispose();
    this.lobbyRoom?.dispose();
    this.cammera.dispose();
    this.scene.dispose();
    this.keyboardInputObserver.remove();
    this.input.dispose();
    this.deviceSourceManager.dispose();
    this.physicsEngine?.dispose();
    this.engine.dispose();
    this.onIsPausedChanged.clear();
    this.onLocalCharacterTargetChanged.clear();

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

    if (this.serverRoom === null) {
      console.error("[Nova Trials]", "Room is null");
      return;
    }

    if (this.physicsEngine === null) {
      console.error("[Nova Trials]", "HavokEngine is null");
      return;
    }

    if (index === this.serverRoom.sessionId) {
      const character = createLocalCharacter(
        this.physicsEngine,
        this.scene,
        this.input,
        this.serverRoom,
        state
      );
      this.characters[index] = character;
      this.cammera.target = character.kinematic.head;

      character.target.onChanged.add(() => {
        this.onLocalCharacterTargetChanged.notifyObservers();
      });
    } else {
      const character = createRemoteCharacter(
        this.scene,
        this.serverRoom,
        state
      );
      this.characters[index] = character;
    }
  }

  private onCharacterRemove(state: CharacterState, index: string) {
    console.log("[Nova Trials]", "Character removed", state.name, index);

    this.characters[index].dispose();
    delete this.characters[index];
  }

  private async onRoomNameChange(room: string) {
    this.room?.dispose();

    switch (room) {
      case RoomName.RedLightGreenLight:
        this.room = await createRedLightGreenLightRoom(this.scene);
        break;
    }
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

    this.serverRoom = await this.client.joinOrCreate(ROOM_NAME, options);
    this.serverRoom.onMessage("*", (type, message) =>
      console.log(type, message)
    );
    this.serverRoom.onError(this.onError.bind(this));
    this.serverRoom.onLeave(this.onLeave.bind(this));

    const $ = getStateCallbacks(this.serverRoom);

    $(this.serverRoom.state).listen(
      "roomName",
      this.onRoomNameChange.bind(this)
    );
    $(this.serverRoom.state).characters.onAdd(this.onCharacterAdd.bind(this));
    $(this.serverRoom.state).characters.onRemove(
      this.onCharacterRemove.bind(this)
    );
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
}
