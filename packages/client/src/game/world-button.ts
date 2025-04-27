import { IInteractable, interactable } from "./interactions/interactable";

export class WorldButton implements IInteractable {
  readonly [interactable]: boolean = true;
  readonly isInteractable: true = true;
}
