import { IDisposable } from "@babylonjs/core";
import { isObjectWithPropertOfType } from "../utils";

export function isDisposable(thing: unknown): thing is IDisposable {
  return isObjectWithPropertOfType(thing, "dispose", "function");
}
