import { Engine, IDisposable, Scene } from "@babylonjs/core";
import { loadDefaultScene as loadDefaultScene } from "./scenes/default-scene";

export class Game implements IDisposable {
  private readonly engine: Engine;

  scene: Scene | null = null;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    console.log("[Nova Trials]", "Initializing game");

    this.engine = new Engine(canvas, true, {}, false);

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  async start() {
    console.log("[Nova Trials]", "Starting game");
    const scene = await loadDefaultScene(this.engine);

    if (this.engine.isDisposed) {
      console.log("[Nova Trials]", "Engine is disposed, aborting start");
      return;
    }

    this.scene = scene;
    this.engine.runRenderLoop(() => scene.render());
  }

  dispose() {
    console.log("[Nova Trials]", "Disposing game");

    this.engine.dispose();
  }

  private onWindowResize() {
    console.log("[Nova Trials]", "Resizing renderer");

    this.engine.resize();
  }
}
