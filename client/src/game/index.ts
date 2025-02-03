import { Engine, HavokPlugin, IDisposable, Scene } from "@babylonjs/core";
import { loadRedLightGreenLightScene } from "./scenes/red-light-green-light-scene";
import HavokPhysics from "@babylonjs/havok";

export class Game implements IDisposable {
  private readonly engine: Engine;
  private havokPlugin: HavokPlugin | null = null;
  scene: Scene | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);

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
    this.engine.runRenderLoop(() => scene.render());
  }

  dispose(): void {
    console.log("[Nova Trials]", "Disposing game");

    this.engine.dispose();
    // this.havokPlugin?.dispose();
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
