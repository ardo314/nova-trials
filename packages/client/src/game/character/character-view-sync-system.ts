export class CharacterViewSyncSystem {
  execute() {
    this.node.position.copyFrom(this.character.node.position);
    this.node.rotation.copyFrom(this.character.node.rotation);
  }
}
