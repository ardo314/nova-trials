import { Observable } from "@babylonjs/core";

export class BaseGame {
  players: Record<number, PlayerState> = {};
  characters: Record<number, CharacterState> = {};
}

export interface PlayerState {
  id: number;
  name: string;
}

export interface CharacterState {
  id: number;
  owner: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
