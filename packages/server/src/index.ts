import { NullEngine } from "@babylonjs/core";
import { hello } from "@nova-trials/shared";
import { Game } from "./game";

const engine = new NullEngine();
const game = new Game();

engine.runRenderLoop(() => {
  game.update();
});
