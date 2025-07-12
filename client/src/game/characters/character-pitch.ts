export interface CharacterPitchGetter {
  get pitch(): number;
}

export interface CharacterPitchSetter {
  set pitch(value: number);
}

export type CharacterPitch = CharacterPitchGetter & CharacterPitchSetter;
