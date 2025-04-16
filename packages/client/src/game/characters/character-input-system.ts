import {
  DeviceSourceManager,
  DeviceType,
  IDisposable,
  IKeyboardEvent,
  IPointerEvent,
  IWheelEvent,
  Observer,
} from "@babylonjs/core";
import { CharacterInput } from ".";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

export class CharacterInputSystem implements IDisposable {
  private readonly deviceConnectedObserver: Observer<DeviceSourceType>;
  private readonly deviceDisconnectedObserver: Observer<DeviceSourceType>;
  private keyboardInputObserver: Observer<IKeyboardEvent> | null = null;
  private mouseInputObserver: Observer<IWheelEvent | IPointerEvent> | null =
    null;

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

  constructor(dsm: DeviceSourceManager) {
    const keyboard = dsm.getDeviceSource(DeviceType.Keyboard);
    const mouse = dsm.getDeviceSource(DeviceType.Mouse);

    if (keyboard) {
      this.onDeviceConnected(keyboard);
    }

    if (mouse) {
      this.onDeviceConnected(mouse);
    }

    this.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(
      this.onDeviceConnected.bind(this)
    );
    this.deviceDisconnectedObserver = dsm.onDeviceDisconnectedObservable.add(
      this.onDeviceDisconnected.bind(this)
    );
  }

  dispose() {
    this.deviceConnectedObserver.remove();
    this.deviceDisconnectedObserver.remove();
    this.keyboardInputObserver?.remove();
    this.mouseInputObserver?.remove();
  }

  private onDeviceConnected(ev: DeviceSourceType) {
    switch (ev.deviceType) {
      case DeviceType.Keyboard:
        this.keyboardInputObserver = ev.onInputChangedObservable.add(
          this.onKeyboardInputChanged.bind(this)
        );
        break;
      case DeviceType.Mouse:
        this.mouseInputObserver = ev.onInputChangedObservable.add(
          this.onMouseInputChanged.bind(this)
        );
    }
  }

  private onDeviceDisconnected(ev: DeviceSourceType) {
    switch (ev.deviceType) {
      case DeviceType.Keyboard:
        this.keyboardInputObserver?.remove();
        this.keyboardInputObserver = null;
        break;
      case DeviceType.Mouse:
        this.mouseInputObserver?.remove();
        this.mouseInputObserver = null;
        break;
    }
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

      pitch: this.pointer.y,
      yaw: this.pointer.x,
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
