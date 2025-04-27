import { isObjectWithPropertOfType } from "../utils";

export const update = Symbol("update");

export interface IUpdateable {
  [update](): void;
}

export function isUpdateable(thing: unknown): thing is IUpdateable {
  return isObjectWithPropertOfType(thing, update, "function");
}
