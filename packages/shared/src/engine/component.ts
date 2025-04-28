import { IDisposable } from "@babylonjs/core";
import { ILateUpdate, IUpdate } from "./types";

export type Component = IUpdate | ILateUpdate | IDisposable;
