import { Actor } from "./actor";
import { Interactable } from "./interactions/interactable";

export class WorldButton extends Actor implements Interactable {
  readonly isInteractable: true = true;

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  update(): void {
    throw new Error("Method not implemented.");
  }
}
