export * from "./spawn-room";
export * from "./messages";
export * from "./state";

export const ROOM_NAME = "game";
export const DEFAULT_CHARACTER_NAME = "Player";
export const SEND_RATE = 1;
export const SEND_DELTA_TIME = 1000 / SEND_RATE;

export type JoinOptions = {
  name?: string;
};
