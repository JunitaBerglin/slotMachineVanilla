import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Config } from "../game/Config";

export class Game {
  constructor(loader) {
    this.loader = loader;
    this.container = new PIXI.Container();

    document
      .getElementById("game-container")
      .appendChild(this.app.view);

    this.board = new Board();
    this.app.stage.addChild(this.board.container);

    this.wheels = [];
    this.createWheels();
    this.createSpinButton();
  }

  createWheels() {
    const positions = [200, 400, 600];
    for (let i = 0; i < 3; i++) {
      const wheel = this.createWheel(positions[i]);
      this.wheels.push(wheel);
      this.container.addChild(wheel);
    }
  }

  createWheel(x) {
    const wheel = new PIXI.Container();
    wheel.x = x;
    wheel.y = 100;
    wheel.tiles = [];
    wheel.className = "wheel";

    for (let i = 0; i < 3; i++) {
      const tile = this.createTile();
      tile.y = i * 100;
      wheel.addChild(tile);
      wheel.tiles.push(tile);
    }

    return wheel;
  }

  createSpinButton() {
    const button = document.createElement("button");
    button.innerText = "Spin";
    button.classList.add("spin-button");
    button.addEventListener("click", () => this.spin());
    document.getElementById("game-container").appendChild(button);
  }

  createTile() {
    const colors = Config.tilesColors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tile = new PIXI.Sprite(
      this.loader.resources[color]?.texture
    );
    tile.anchor.set(0.5);
    tile.x = 0;
    return tile;
  }

  spin() {
    const duration = 2000;
    this.wheels.forEach((wheel, index) => {
      const delay = index * 200;
      gsap.to(wheel, {
        y: wheel.y + 600,
        duration: duration / 1000,
        ease: "power1.inOut",
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          wheel.tiles.forEach((tile, tileIndex) => {
            tile.texture = PIXI.Texture.from(
              Config.tilesColors[
                Math.floor(Math.random() * Config.tilesColors.length)
              ]
            );
          });
          if (index === this.wheels.length - 1) {
            this.checkWin();
          }
        },
      });
    });
  }

  checkWin() {
    const middleTiles = this.wheels.map(
      (wheel) => wheel.tiles[1].texture
    );
    if (
      middleTiles[0] === middleTiles[1] &&
      middleTiles[1] === middleTiles[2]
    ) {
      console.log("We have a winner!");
      this.playWinAnimation();
    } else {
      console.log("No win, try again.");
    }
  }

  playWinAnimation() {
    // win animation here
    console.log("Playing win animation...");
  }
}
