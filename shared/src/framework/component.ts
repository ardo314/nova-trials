import { IDisposable } from "@babylonjs/core";
import { ILateUpdate, IUpdate } from "./events";

export type Component = IUpdate | ILateUpdate | IDisposable;
