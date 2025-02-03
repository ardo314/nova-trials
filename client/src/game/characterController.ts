import {
  DeviceSourceManager,
  DeviceType,
  IDisposable,
  IKeyboardEvent,
  Observer,
} from "@babylonjs/core";
import { Character, CharacterInput } from "./character";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

export class CharacterController implements IDisposable {
  private readonly deviceConnectedObserver: Observer<DeviceSourceType>;
  private readonly deviceDisconnectedObserver: Observer<DeviceSourceType>;
  private keyboardInputObserver: Observer<IKeyboardEvent> | null = null;

  private input: CharacterInput = {
    forward: 0,
    right: 0,
  };

  constructor(dsm: DeviceSourceManager, private character: Character) {
    const keyboard = dsm.getDeviceSource(DeviceType.Keyboard);

    if (keyboard) {
      this.onDeviceConnected(keyboard);
    }

    this.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(
      this.onDeviceConnected.bind(this)
    );
    this.deviceDisconnectedObserver = dsm.onDeviceDisconnectedObservable.add(
      this.onDeviceDisconnected.bind(this)
    );
  }

  private onDeviceConnected(ev: DeviceSourceType) {
    switch (ev.deviceType) {
      case DeviceType.Keyboard:
        this.keyboardInputObserver = ev.onInputChangedObservable.add(
          this.onKeyboardInputChanged.bind(this)
        );
        break;
    }
  }

  private onDeviceDisconnected(ev: DeviceSourceType) {
    switch (ev.deviceType) {
      case DeviceType.Keyboard:
        this.keyboardInputObserver?.remove();
        this.keyboardInputObserver = null;
        break;
    }
  }

  private onKeyboardInputChanged(ev: IKeyboardEvent) {
    switch (ev.key) {
      case "w":
        this.input.forward = ev.type === "keydown" ? 1 : 0;
        break;
      case "s":
        this.input.forward = ev.type === "keydown" ? -1 : 0;
        break;
      case "a":
        this.input.right = ev.type === "keydown" ? -1 : 0;
        break;
      case "d":
        this.input.right = ev.type === "keydown" ? 1 : 0;
        break;
    }
  }

  update() {}

  dispose(): void {
    this.deviceConnectedObserver.remove();
    this.deviceDisconnectedObserver.remove();
    this.keyboardInputObserver?.remove();
  }
}
