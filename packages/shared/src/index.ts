import { Observable } from "@babylonjs/core";

export class BaseGameState {
  players: Record<number, PlayerState> = {};
  characters: Record<number, CharacterState> = {};

  onPlayerAdd: Observable<PlayerState> = new Observable();
  onPlayerRemove: Observable<PlayerState> = new Observable();

  onCharacterAdd: Observable<CharacterState> = new Observable();
  onCharacterRemove: Observable<CharacterState> = new Observable();
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
