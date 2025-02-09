"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const core_1 = require("@babylonjs/core");
const red_light_green_light_scene_1 = require("./scenes/red-light-green-light-scene");
const havok_1 = __importDefault(require("@babylonjs/havok"));
const shared_1 = require("shared");
class Game {
    constructor(window, canvas) {
        this.havokPlugin = null;
        this.scene = null;
        console.log("[Nova Trials]", "Initializing game");
        this.engine = new core_1.Engine(canvas, true, {}, false);
        this.deviceSourceManager = new core_1.DeviceSourceManager(this.engine);
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[Nova Trials]", "Starting game");
            this.havokPlugin = yield this.loadHavokPhysics();
            const scene = yield (0, red_light_green_light_scene_1.loadRedLightGreenLightScene)(this.engine, this.havokPlugin);
            if (this.engine.isDisposed) {
                console.log("[Nova Trials]", "Engine is disposed, aborting start");
                return;
            }
            (0, shared_1.hello)();
            this.scene = scene;
            this.engine.runRenderLoop(() => {
                scene.render();
            });
        });
    }
    dispose() {
        var _a;
        console.log("[Nova Trials]", "Disposing game");
        this.engine.dispose();
        this.deviceSourceManager.dispose();
        (_a = this.havokPlugin) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    loadHavokPhysics() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[Nova Trials]", "Loading Havok Physics");
            return new core_1.HavokPlugin(true, yield (0, havok_1.default)());
        });
    }
    onWindowResize() {
        console.log("[Nova Trials]", "Resizing renderer");
        this.engine.resize();
    }
}
exports.Game = Game;
