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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDefaultScene = loadDefaultScene;
const core_1 = require("@babylonjs/core");
function loadDefaultScene(engine, _) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("[Nova Trials]", "Loading default scene");
        const scene = new core_1.Scene(engine);
        const camera = new core_1.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new core_1.Vector3(0, 0, 0), scene);
        camera.attachControl(engine.getRenderingCanvas(), true);
        new core_1.HemisphericLight("light", new core_1.Vector3(0, 1, 0), scene);
        core_1.MeshBuilder.CreateBox("box", {}, scene);
        return Promise.resolve(scene);
    });
}
