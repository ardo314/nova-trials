import { isObjectWithPropertOfType } from "./framework/utils";

export const interactable = Symbol("interactable");

export interface IInteractable {
  readonly [interactable]: boolean;
}

export function isInteractable(obj: unknown): obj is IInteractable {
  if (!isObjectWithPropertOfType<IInteractable>(obj, interactable, "boolean"))
    return false;
  if (obj[interactable] !== true) return false;

  return true;
}
