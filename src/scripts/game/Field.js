export class Field {
  constructor(loader, row, col) {
    this.row = row;
    this.col = col;
  }

  setTile(tile) {
    this.tile = tile;
    tile.field = this;
    tile.setPosition(this.position);
  }
}
