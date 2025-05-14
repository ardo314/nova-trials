import { IDisposable, Observable } from "@babylonjs/core";
import { IInteractable } from "../interactions/interactable";

export class CharacterTarget implements IDisposable {
  readonly onChanged: Observable<void> = new Observable<void>();

  private _value: IInteractable | null = null;

  get value(): IInteractable | null {
    return this._value;
  }

  set value(newValue: IInteractable | null) {
    if (this._value === newValue) {
      return;
    }

    this._value = newValue;
    this.onChanged.notifyObservers();
  }

  dispose() {
    this.onChanged.clear();
  }
}
