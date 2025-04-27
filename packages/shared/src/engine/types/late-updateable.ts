import { isObjectWithPropertOfType } from "../utils";

export const lateUpdate = Symbol("lateUpdate");

export interface ILateUpdateable {
  [lateUpdate](): void;
}

export function isLateUpdateable(thing: unknown): thing is ILateUpdateable {
  return isObjectWithPropertOfType(thing, lateUpdate, "function");
}
