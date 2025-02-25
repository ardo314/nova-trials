import { MapSchema, Schema, type } from "@colyseus/schema";

export const ROOM_NAME = "game";
export const DEFAULT_CHARACTER_NAME = "Player";

export type JoinOptions = {
  name?: string;
};

export namespace SetTransform {
  export const Type = "set-transform";

  export type Message = {
    x: number;
    y: number;
    z: number;
  };
}

export class PositionState extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class RotationState extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class CharacterState extends Schema {
  @type("string") name: string = "Player";
  @type(PositionState) position: PositionState = new PositionState();
  @type(RotationState) rotation: RotationState = new RotationState();
}

export class GameState extends Schema {
  @type({ map: CharacterState }) characters = new MapSchema<CharacterState>();
}
