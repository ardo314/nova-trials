import { IDisposable } from "@babylonjs/core";

export abstract class Actor implements IDisposable {
  abstract dispose(): void;
  abstract update(): void;
}
