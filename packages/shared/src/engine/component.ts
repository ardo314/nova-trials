import { IDisposable } from "@babylonjs/core";
import { ILateUpdateable, IUpdateable } from "./types";

export type Component = IUpdateable | ILateUpdateable | IDisposable;
