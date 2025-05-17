import { IDisposable, Mesh } from "@babylonjs/core";
import { IInteractable, interactable } from "./interactions/interactable";

export type WorldButton = IDisposable & IInteractable;

export function attachWorldButton(mesh: Mesh): WorldButton {
  const worldButton: WorldButton = {
    [interactable]: true,
    dispose: () => {},
  };
  mesh.metadata = worldButton;
  return worldButton;
}
