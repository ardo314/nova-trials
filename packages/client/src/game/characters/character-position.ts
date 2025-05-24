import { Vector3 } from "@babylonjs/core";

export interface CharacterPositionGetter {
  get position(): Vector3;
}

export interface CharacterPositionSetter {
  set position(value: Vector3);
}

export type CharacterPosition = CharacterPositionGetter &
  CharacterPositionSetter;
