import { app } from "../system/App";

export class Field {
  constructor(row, col) {
    this.row = row;
    this.col = col;

    this.sprite = app.sprite("field");
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  get position() {
    return {
      x: this.col * this.sprite.width,
      y: this.row * this.sprite.height,
    };
  }

  setTile(tile) {
    this.tile = tile;
    tile.field = this;
    tile.setPosition(this.position);
  }
}
