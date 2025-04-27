import { Component } from "./component";
import {
  ILateUpdateable,
  isLateUpdateable,
  lateUpdate,
} from "./types/late-updateable";
import { isUpdateable, IUpdateable, update } from "./types/updateable";

type Command = () => void;

export class PlayerLoop {
  private static updates: IUpdateable[] = [];
  private static lateUpdates: ILateUpdateable[] = [];
  private static commandStack: Command[] = [];

  static tick() {
    for (const x of this.updates) {
      x[update]();
    }

    for (const x of this.lateUpdates) {
      x[lateUpdate]();
    }

    this.processCommands();
  }

  static addComponent(component: Component) {
    this.commandStack.push(() => {
      if (isUpdateable(component)) {
        this.updates.push(component);
      }
      if (isLateUpdateable(component)) {
        this.lateUpdates.push(component);
      }
    });
  }

  static removeComponent(component: Component) {
    this.commandStack.push(() => {
      if (isUpdateable(component)) {
        const index = this.updates.indexOf(component);
        if (index !== -1) {
          this.updates.splice(index, 1);
        }
      }
      if (isLateUpdateable(component)) {
        const index = this.lateUpdates.indexOf(component);
        if (index !== -1) {
          this.lateUpdates.splice(index, 1);
        }
      }
    });
  }

  private static processCommands() {
    while (this.commandStack.length > 0) {
      const command = this.commandStack.pop();
      if (command) {
        command();
      }
    }
  }
}
