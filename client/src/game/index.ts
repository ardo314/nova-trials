import {
  DeviceSourceManager,
  DeviceType,
  Engine,
  HavokPlugin,
  IDisposable,
  Scene,
  XboxInput,
} from "@babylonjs/core";
import { loadRedLightGreenLightScene } from "./scenes/red-light-green-light-scene";
import HavokPhysics from "@babylonjs/havok";
import { Character } from "./character";
import { CharacterController } from "./characterController";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private readonly deviceSourceManager: DeviceSourceManager;
  private havokPlugin: HavokPlugin | null = null;
  scene: Scene | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);
    this.deviceSourceManager = new DeviceSourceManager(this.engine);

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

    const character = new Character(scene);
    const characterController = new CharacterController(
      this.deviceSourceManager,
      character
    );

    this.engine.runRenderLoop(() => {
      characterController.update();

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
