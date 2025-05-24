import { Component } from "./component";
import { ILateUpdate, hasLateUpdate, lateUpdate } from "./events/late-update";
import { hasUpdate, IUpdate, update } from "./events/update";

type Command = () => void;

export class PlayerLoop {
  private static updates: IUpdate[] = [];
  private static lateUpdates: ILateUpdate[] = [];
  private static commandQueue: Command[] = [];

  static tick() {
    this.processCommands();

    for (const x of this.updates) {
      x[update]();
    }

    for (const x of this.lateUpdates) {
      x[lateUpdate]();
    }
  }

  static addComponent(component: Component) {
    this.commandQueue.push(() => {
      if (hasUpdate(component)) {
        this.updates.push(component);
      }
      if (hasLateUpdate(component)) {
        this.lateUpdates.push(component);
      }
    });
  }

  static removeComponent(component: Component) {
    this.commandQueue.push(() => {
      if (hasUpdate(component)) {
        const index = this.updates.indexOf(component);
        if (index !== -1) {
          this.updates.splice(index, 1);
        }
      }
      if (hasLateUpdate(component)) {
        const index = this.lateUpdates.indexOf(component);
        if (index !== -1) {
          this.lateUpdates.splice(index, 1);
        }
      }
    });
  }

  private static processCommands() {
    while (this.commandQueue.length > 0) {
      this.commandQueue.shift()?.();
    }
  }
}
