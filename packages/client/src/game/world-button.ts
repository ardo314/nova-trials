import { IDisposable, Mesh } from "@babylonjs/core";
import {
  IInteractable,
  interactable,
  ITargetable,
  targetable,
} from "@nova-trials/shared";

export type WorldButton = IDisposable & ITargetable & IInteractable;

export function attachWorldButton(mesh: Mesh): WorldButton {
  const worldButton: WorldButton = {
    [targetable]: true,
    [interactable]: true,
    dispose: () => {},
  };
  mesh.metadata = worldButton;
  return worldButton;
}
