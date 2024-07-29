import * as PIXI from "pixi.js";
import { app } from "../system/App";
import { Field } from "./Field";

export class Board {
  constructor(loader) {
    this.container = new PIXI.Container();
    this.fields = [];
    this.rows = app.config.board.rows;
    this.cols = app.config.board.cols;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const field = new Field(loader, row, col);
        if (field.sprite) {
          this.fields.push(field);
          this.container.addChild(field.sprite);
        }
      }
    }
  }
}
