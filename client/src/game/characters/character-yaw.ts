export interface CharacterYawGetter {
  get yaw(): number;
}

export interface CharacterYawSetter {
  set yaw(value: number);
}

export type CharacterYaw = CharacterYawGetter & CharacterYawSetter;
