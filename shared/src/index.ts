import { Vector3 } from "@babylonjs/core";

export * from "./framework";
export * from "./math";
export * from "./interactable";
export * from "./messages";
export * from "./state";
export * from "./targetable";

export const ROOM_NAME = "game";
export const DEFAULT_CHARACTER_NAME = "Player";
export const SEND_RATE = 10;
export const SEND_DELTA_TIME = 1000 / SEND_RATE;
export const CHARACTER_HEIGHT = 2;
export const CHARACTER_EYE_HEIGHT = 1.7;
export const CHARACTER_RADIUS = 0.5;
export const CHARACTER_CENTER = new Vector3(0, CHARACTER_HEIGHT / 2, 0);

export enum RoomName {
  RedLightGreenLight = "red-light-green-light",
}

export type JoinOptions = {
  name?: string;
};

export function getRandomElement<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
