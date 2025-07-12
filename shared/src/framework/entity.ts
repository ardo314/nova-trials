import { IDisposable } from "@babylonjs/core";
import { isDisposable } from "./events/disposable";
import { Component } from "./component";
import { PlayerLoop } from "./player-loop";

export class Entity implements IDisposable {
  private static instances: Entity[] = [];

  private components: Component[] = [];

  constructor() {
    Entity.instances.push(this);
  }

  dispose() {
    for (const component of this.components) {
      PlayerLoop.removeComponent(component);

      if (isDisposable(component)) {
        component.dispose();
      }
    }

    const index = Entity.instances.indexOf(this);
    if (index !== -1) {
      Entity.instances.splice(index, 1);
    }
  }

  add<T extends Component>(component: T) {
    if (this.components.includes(component)) {
      throw new Error("Component already added to entity");
    }

    this.components.push(component);
    PlayerLoop.addComponent(component);
    return component;
  }
}
