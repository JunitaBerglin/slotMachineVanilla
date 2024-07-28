import * as PIXI from "pixi.js";
import { app } from "../system/App";

export class Board {
  constructor() {
    this.container = new PIXI.Container();
    this.fields = [];
    this.rows = app.config.board.rows;
    this.cols = app.config.board.cols;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
      }
    }
  }
}
