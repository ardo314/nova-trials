import { MapSchema, Schema, type } from "@colyseus/schema";

export class Vector3State extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class RotationState extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
}

export class CharacterState extends Schema {
  @type("string") name: string = "Player";
  @type(Vector3State) position: Vector3State = new Vector3State();
  @type(RotationState) rotation: RotationState = new RotationState();
}

export class GameState extends Schema {
  @type("string") level: string = "";
  @type({ map: CharacterState }) characters = new MapSchema<CharacterState>();
}
