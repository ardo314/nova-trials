import {
  DeviceSourceManager,
  Engine,
  HavokPlugin,
  IDisposable,
  Scene,
} from "@babylonjs/core";
import { loadRedLightGreenLightScene } from "./scenes/red-light-green-light-scene";
import HavokPhysics from "@babylonjs/havok";
import { Client } from "colyseus.js";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private readonly client: Client;
  private havokPlugin: HavokPlugin | null = null;
  scene: Scene | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.deviceSourceManager = new DeviceSourceManager(this.engine);

    this.client = new Client("http://localhost:2567");
    this.client.joinOrCreate("my_room");

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  async start() {
    console.log("[Nova Trials]", "Starting game");

    this.havokPlugin = await this.loadHavokPhysics();

    const scene = await loadRedLightGreenLightScene(
      this.engine,
      this.havokPlugin
    );

    if (this.engine.isDisposed) {
      console.log("[Nova Trials]", "Engine is disposed, aborting start");
      return;
    }

    this.scene = scene;

    this.engine.runRenderLoop(() => {
      scene.render();
    });
  }

  dispose(): void {
    console.log("[Nova Trials]", "Disposing game");

    this.engine.dispose();
    this.deviceSourceManager.dispose();
    this.havokPlugin?.dispose();
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
