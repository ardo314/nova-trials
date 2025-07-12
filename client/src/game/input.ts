import {
  DeviceSourceManager,
  DeviceType,
  IDisposable,
  IKeyboardEvent,
  IPointerEvent,
  IWheelEvent,
  Observable,
  Observer,
} from "@babylonjs/core";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

export class Input implements IDisposable {
  private readonly deviceConnectedObserver: Observer<DeviceSourceType>;
  private readonly deviceDisconnectedObserver: Observer<DeviceSourceType>;
  private keyboardInputObserver: Observer<IKeyboardEvent> | null = null;
  private mouseInputObserver: Observer<IWheelEvent | IPointerEvent> | null =
    null;

  readonly onKeyboardInput: Observable<IKeyboardEvent> =
    new Observable<IKeyboardEvent>();

  readonly onMouseInput: Observable<IWheelEvent | IPointerEvent> =
    new Observable<IWheelEvent | IPointerEvent>();

  constructor(dsm: DeviceSourceManager) {
    this.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(
      this.onDeviceConnected.bind(this)
    );
    this.deviceDisconnectedObserver = dsm.onDeviceDisconnectedObservable.add(
      this.onDeviceDisconnected.bind(this)
    );

    const keyboard = dsm.getDeviceSource(DeviceType.Keyboard);
    if (keyboard) {
      this.onDeviceConnected(keyboard);
    }

    const mouse = dsm.getDeviceSource(DeviceType.Mouse);
    if (mouse) {
      this.onDeviceConnected(mouse);
    }
  }

  dispose() {
    this.deviceConnectedObserver.remove();
    this.deviceDisconnectedObserver.remove();
    this.keyboardInputObserver?.remove();
    this.mouseInputObserver?.remove();

    this.onKeyboardInput.clear();
    this.onMouseInput.clear();
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
    this.onKeyboardInput.notifyObservers(ev);
  }

  private onMouseInputChanged(ev: IWheelEvent | IPointerEvent) {
    this.onMouseInput.notifyObservers(ev);
  }
}
