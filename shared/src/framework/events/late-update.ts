import { isObjectWithPropertOfType } from "../utils";

export const lateUpdate = Symbol("lateUpdate");

export interface ILateUpdate {
  [lateUpdate](): void;
}

export function hasLateUpdate(thing: unknown): thing is ILateUpdate {
  return isObjectWithPropertOfType(thing, lateUpdate, "function");
}
