"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
const core_1 = require("@babylonjs/core");
class CharacterController {
    constructor(dsm, character) {
        this.character = character;
        this.keyboardInputObserver = null;
        this.input = {
            forward: 0,
            right: 0,
        };
        const keyboard = dsm.getDeviceSource(core_1.DeviceType.Keyboard);
        if (keyboard) {
            this.onDeviceConnected(keyboard);
        }
        this.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(this.onDeviceConnected.bind(this));
        this.deviceDisconnectedObserver = dsm.onDeviceDisconnectedObservable.add(this.onDeviceDisconnected.bind(this));
    }
    onDeviceConnected(ev) {
        switch (ev.deviceType) {
            case core_1.DeviceType.Keyboard:
                this.keyboardInputObserver = ev.onInputChangedObservable.add(this.onKeyboardInputChanged.bind(this));
                break;
        }
    }
    onDeviceDisconnected(ev) {
        var _a;
        switch (ev.deviceType) {
            case core_1.DeviceType.Keyboard:
                (_a = this.keyboardInputObserver) === null || _a === void 0 ? void 0 : _a.remove();
                this.keyboardInputObserver = null;
                break;
        }
    }
    onKeyboardInputChanged(ev) {
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
    update(dt) {
        this.character.simulate(this.input, dt);
    }
    dispose() {
        var _a;
        this.deviceConnectedObserver.remove();
        this.deviceDisconnectedObserver.remove();
        (_a = this.keyboardInputObserver) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
exports.CharacterController = CharacterController;
