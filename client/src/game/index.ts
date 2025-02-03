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

    const blubb = this.deviceSourceManager.onDeviceConnectedObservable.add(
      (ev) => {
        console.log("[Nova Trials]", "Device connected", ev);

        switch (ev.deviceType) {
          case DeviceType.Keyboard:
            ev.onInputChangedObservable.add((ev) => {
              console.log("[Nova Trials]", "Keyboard input changed", ev);
            });
            break;
        }
      }
    );

    this.scene = scene;
    this.engine.runRenderLoop(() => scene.render());
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
