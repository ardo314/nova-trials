import {
  IDisposable,
  IKeyboardEvent,
  IPointerEvent,
  IWheelEvent,
  Observer,
} from "@babylonjs/core";
import { Input } from "../input";
import { CharacterInput } from "./character-input";
import { IUpdate, update } from "@nova-trials/shared";

export class CharacterInputSystem implements IDisposable, IUpdate {
  private readonly keyboardInputObserver: Observer<IKeyboardEvent>;
  private readonly mouseInputObserver: Observer<IWheelEvent | IPointerEvent>;

  private keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    leftMouse: false,
  };

  private pointer = {
    x: 0,
    y: 0,
  };

  constructor(input: Input, private readonly characterInput: CharacterInput) {
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
      case " ":
        this.keys.space = ev.type === "keydown";
        break;
    }
  }

  private onMouseInputChanged(ev: IWheelEvent | IPointerEvent) {
    this.pointer.x += ev.movementX;
    this.pointer.y += ev.movementY;
    this.keys.leftMouse = false;
  }

  [update]() {
    this.characterInput.pitch = this.pointer.y * 0.005;
    this.characterInput.yaw = this.pointer.x * 0.005;

    this.pointer.x = 0;
    this.pointer.y = 0;

    this.characterInput.forward = 0;
    this.characterInput.right = 0;

    if (this.keys.w) {
      this.characterInput.forward += 1;
    }
    if (this.keys.s) {
      this.characterInput.forward -= 1;
    }
    if (this.keys.a) {
      this.characterInput.right -= 1;
    }
    if (this.keys.d) {
      this.characterInput.right += 1;
    }

    this.characterInput.jump = this.keys.space;
    this.characterInput.interact = this.keys.leftMouse;
  }
}
