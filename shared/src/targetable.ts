import { isObjectWithPropertOfType } from "./framework/utils";

export const targetable = Symbol("targetable");

export interface ITargetable {
  readonly [targetable]: boolean;
}

export function isTargetable(obj: unknown): obj is ITargetable {
  if (!isObjectWithPropertOfType<ITargetable>(obj, targetable, "boolean"))
    return false;
  if (obj[targetable] !== true) return false;

  return true;
}
