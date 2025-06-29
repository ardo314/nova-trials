import { isObjectWithPropertOfType } from "../utils";

export const executionOrder = Symbol("lateUpdate");

export interface IExecutionOrder {
  readonly [executionOrder]: number;
}

export function hasExecutionOrder(thing: unknown): thing is IExecutionOrder {
  return isObjectWithPropertOfType(thing, executionOrder, "number");
}
