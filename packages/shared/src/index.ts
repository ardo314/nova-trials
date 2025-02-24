import { Schema, type } from "@colyseus/schema";

export const ROOM_NAME = "game";

export class GameState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";
}
