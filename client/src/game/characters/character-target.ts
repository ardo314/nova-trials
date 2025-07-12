import { IDisposable, Observable } from "@babylonjs/core";
import { ITargetable } from "@nova-trials/shared";

export class CharacterTarget implements IDisposable {
  readonly onChanged: Observable<void> = new Observable<void>();

  private _value: ITargetable | null = null;

  get value(): ITargetable | null {
    return this._value;
  }

  set value(newValue: ITargetable | null) {
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
