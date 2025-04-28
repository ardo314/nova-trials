import { isObjectWithPropertOfType } from "../utils";

export const update = Symbol("update");

export interface IUpdate {
  [update](): void;
}

export function hasUpdate(thing: unknown): thing is IUpdate {
  return isObjectWithPropertOfType(thing, update, "function");
}
