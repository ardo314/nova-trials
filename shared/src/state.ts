import { MapSchema, Schema, type } from "@colyseus/schema";
import { RoomName } from ".";

export class Vector3State extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class QuaternionState extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") w: number = 0;
}

export class CharacterRotationState extends Schema {
  @type("number") pitch: number = 0;
  @type("number") yaw: number = 0;
}

export class CharacterState extends Schema {
  @type("string") name: string = "Player";
  @type(Vector3State) position: Vector3State = new Vector3State();
  @type(CharacterRotationState) rotation: CharacterRotationState =
    new CharacterRotationState();
  @type("boolean") isReady: boolean = false;
}

export class GameState extends Schema {
  @type("string") roomName: RoomName | "" = "";
  @type({ map: CharacterState }) characters = new MapSchema<CharacterState>();
}
