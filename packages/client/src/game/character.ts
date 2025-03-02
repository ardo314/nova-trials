import {
  float,
  IDisposable,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { CharacterState } from "@nova-trials/shared";

export interface CharacterInput {
  forward: number;
  right: number;
}

const SPEED = 5 / 1000;

export class Character implements IDisposable {
  readonly node: TransformNode;
  readonly headNode: TransformNode;

  constructor(scene: Scene) {
    this.node = new TransformNode("character", scene);

    this.headNode = new TransformNode("head", scene);
    this.headNode.setParent(this.node);
    this.headNode.position.y = 1.5;
  }

  simulate(input: CharacterInput, dt: float): void {
    const axis = new Vector3(input.right, 0, input.forward);
    axis.normalize();

    this.node.translate(axis, dt * SPEED);
  }

  dispose(): void {
    this.node.dispose();
  }

  fromState(state: CharacterState): void {
    const { x, y, z } = state.position;
    const { x: rx, y: ry, z: rz } = state.rotation;
    this.node.position.copyFromFloats(x, y, z);
    this.node.rotation.copyFromFloats(rx, ry, rz);
  }
}
