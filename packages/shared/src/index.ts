export * from "./spawn-room";
export * from "./messages";
export * from "./state";
export * from "./levels";

export const ROOM_NAME = "game";
export const DEFAULT_CHARACTER_NAME = "Player";
export const SEND_RATE = 10;
export const SEND_DELTA_TIME = 1000 / SEND_RATE;

export type JoinOptions = {
  name?: string;
};

export function getRandomElement<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
