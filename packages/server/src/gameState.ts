import { BaseGameState } from "@nova-trials/shared";

export class GameState extends BaseGameState {
  private currentEntityId: number = 0;

  addPlayer() {
    this.players[this.currentEntityId] = {
      id: this.currentEntityId,
      name: "Player " + this.currentEntityId,
    };

    this.currentEntityId++;
  }

  removePlayer(id: number) {
    this.removeCharacter(id);

    delete this.players[id];
  }

  addCharacter() {
    this.characters[this.currentEntityId] = {
      id: this.currentEntityId,
      owner: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    };

    this.currentEntityId++;
  }

  removeCharacter(ownerId: number) {
    for (const id in this.characters) {
      if (this.characters[id].owner === ownerId) {
        delete this.characters[id];
        break;
      }
    }
  }
}
