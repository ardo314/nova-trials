"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterView = void 0;
const core_1 = require("@babylonjs/core");
class CharacterView {
    constructor(character, scene) {
        this.character = character;
        this.node = new core_1.TransformNode("characterView", scene);
        this.mesh = core_1.MeshBuilder.CreateBox("box", { height: 2, width: 1, depth: 1 }, scene);
        this.mesh.setParent(this.node);
        this.mesh.position.y = 1;
    }
    update() {
        this.node.position.copyFrom(this.character.node.position);
        this.node.rotation.copyFrom(this.character.node.rotation);
    }
    dispose() {
        this.node.dispose();
        this.mesh.dispose();
    }
}
exports.CharacterView = CharacterView;
