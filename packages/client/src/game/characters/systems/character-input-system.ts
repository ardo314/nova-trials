import {
  IDisposable,
  IKeyboardEvent,
  IPointerEvent,
  IWheelEvent,
  Observer,
} from "@babylonjs/core";
import { Input } from "../../input";
import { CharacterInput } from "../types/character-input";

export class CharacterInputSystem implements IDisposable {
  private readonly keyboardInputObserver: Observer<IKeyboardEvent>;
  private readonly mouseInputObserver: Observer<IWheelEvent | IPointerEvent>;

  private keys = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  private pointer = {
    x: 0,
    y: 0,
  };

  constructor(input: Input) {
    this.keyboardInputObserver = input.onKeyboardInput.add(
      this.onKeyboardInputChanged.bind(this)
    );
    this.mouseInputObserver = input.onMouseInput.add(
      this.onMouseInputChanged.bind(this)
    );
  }

  dispose() {
    this.keyboardInputObserver.remove();
    this.mouseInputObserver.remove();
  }

  private onKeyboardInputChanged(ev: IKeyboardEvent) {
    switch (ev.key) {
      case "w":
        this.keys.w = ev.type === "keydown";
        break;
      case "a":
        this.keys.a = ev.type === "keydown";
        break;
      case "s":
        this.keys.s = ev.type === "keydown";
        break;
      case "d":
        this.keys.d = ev.type === "keydown";
        break;
    }
  }

  private onMouseInputChanged(ev: IWheelEvent | IPointerEvent) {
    this.pointer.x += ev.movementX;
    this.pointer.y += ev.movementY;
  }

  execute(): CharacterInput {
    const input: CharacterInput = {
      forward: 0,
      right: 0,

      pitch: this.pointer.y * 0.005,
      yaw: this.pointer.x * 0.005,
    };

    this.pointer.x = 0;
    this.pointer.y = 0;

    if (this.keys.w) {
      input.forward += 1;
    }
    if (this.keys.s) {
      input.forward -= 1;
    }
    if (this.keys.a) {
      input.right -= 1;
    }
    if (this.keys.d) {
      input.right += 1;
    }

    return input;
  }
}
