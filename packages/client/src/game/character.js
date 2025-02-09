"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const core_1 = require("@babylonjs/core");
const SPEED = 5 / 1000;
class Character {
    constructor(scene) {
        this.node = new core_1.TransformNode("character", scene);
        this.headNode = new core_1.TransformNode("head", scene);
        this.headNode.setParent(this.node);
        this.headNode.position.y = 1.5;
    }
    simulate(input, dt) {
        const axis = new core_1.Vector3(input.right, 0, input.forward);
        axis.normalize();
        this.node.translate(axis, dt * SPEED);
    }
    dispose() {
        this.node.dispose();
    }
}
exports.Character = Character;
