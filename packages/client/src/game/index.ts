import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  IDisposable,
  Scene,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { GameState, ROOM_NAME } from "@nova-trials/shared";
import { Client, getStateCallbacks, Room } from "colyseus.js";

const SERVER_HOST = "http://localhost:2567";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly client: Client;
  private havokPlugin: HavokPlugin | null = null;
  private room: Room<GameState> | null = null;
  scene: Scene | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
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

    this.havokPlugin = await this.loadHavokPhysics();

    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });

    this.join();
  }

  private onStateChange(state: GameState) {
    console.log(state);
  }

  private onError(code: number, message?: string) {
    console.error("[Nova Trials]", "Error", code, message);
  }

  private onLeave(code: number) {
    console.log("[Nova Trials]", "Leaving room", code);
  }

  private async join() {
    console.log("[Nova Trials]", "Joining room");

    this.room = await this.client.joinOrCreate(ROOM_NAME);
    this.room.onStateChange(this.onStateChange.bind(this));
    this.room.onMessage("*", (type, message) => console.log(type, message));
    this.room.onError(this.onError.bind(this));
    this.room.onLeave(this.onLeave.bind(this));

    const $ = getStateCallbacks(this.room);
  }

  private async loadHavokPhysics() {
    console.log("[Nova Trials]", "Loading Havok Physics");

    return new HavokPlugin(true, await HavokPhysics());
  }

  private onWindowResize() {
    console.log("[Nova Trials]", "Resizing renderer");

    this.engine.resize();
  }
}
