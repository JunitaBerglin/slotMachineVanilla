import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Config } from "../game/Config";
import { verticalLoop } from "./VerticalLoop";

export class Game {
  constructor(loader, app) {
    this.loader = loader;
    this.app = app;
    this.container = new PIXI.Container();

    document
      .getElementById("game-container")
      .appendChild(this.app.view);

    this.board = new Board(loader);
    this.app.stage.addChild(this.board.container);

    this.createHighlightBox();

    this.wheels = [];
    this.createWheels();
    this.createSpinButton();

    this.container.x = (app.screen.width - this.container.width) / 4;
    this.container.y =
      (app.screen.height - this.container.height) / 2;
  }

  createHighlightBox() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xff0000, 1);
    graphics.drawRect(
      this.app.screen.width / 3 - 100,
      this.app.screen.height / 2 - 70,
      500,
      120
    );
    this.app.stage.addChild(graphics);
  }

  createWheels() {
    const positions = [
      this.app.screen.width / 3 - 100,
      this.app.screen.width / 2 - 100,
      (2 * this.app.screen.width) / 3 - 100,
    ];
    for (let i = 0; i < positions.length; i++) {
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

    const totalTiles = 100;
    for (let i = 0; i < totalTiles; i++) {
      const tile = this.createTile();
      tile.y = i * 100;
      wheel.addChild(tile);
      wheel.tiles.push(tile);
    }

    wheel.loop = verticalLoop(wheel.children, {
      speed: 200,
      repeat: -1,
    });

    return wheel;
  }

  createSpinButton() {
    const button = document.createElement("button");
    button.innerText = "Spin";
    button.classList.add("spin-button");

    button.addEventListener("click", this.toggleSpin.bind(this));

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
    tile.width = 100;
    tile.height = 100;

    return tile;
  }

  toggleSpin(event) {
    const button = event.target;
    if (this.isSpinning) {
      this.stopSpin(button);
    } else {
      this.startSpin(button);
    }
  }

  startSpin(button) {
    this.isSpinning = true;
    button.innerText = "Stop";
    button.style.backgroundColor = "red";

    this.wheels.forEach((wheel) => {
      if (!wheel.loop || wheel.loop.paused()) {
        wheel.loop = verticalLoop(wheel.children, {
          speed: 200,
          repeat: -1,
        });
      }
      wheel.loop.play(0);
    });
  }

  stopSpin(button) {
    this.isSpinning = false;
    button.innerText = "Spin";
    button.style.backgroundColor = "";

    let completedAnimations = 0;
    const totalWheels = this.wheels.length;

    this.wheels.forEach((wheel) => {
      gsap.killTweensOf(wheel.children);

      let randomIndex = gsap.utils.random(
        0,
        wheel.tiles.length - 1,
        1
      );
      gsap.to(wheel.children, {
        y: `+=${100 * randomIndex}`,
        duration: 1,
        ease: "power4.out",
        modifiers: {
          y: gsap.utils.unitize(
            (y) => parseFloat(y) % (wheel.tiles.length * 100)
          ),
        },
        onComplete: () => {
          completedAnimations += 1;
          if (completedAnimations === totalWheels) {
            this.checkWin();
          }
        },
      });

      wheel.loop.pause();
    });
  }

  checkWin() {
    const middleTiles = this.wheels.map(
      (wheel) =>
        wheel.children[Math.floor(wheel.children.length / 2)].texture
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
    const video = document.getElementById("win-video");
    video.style.display = "block";
    video.play();

    video.onended = () => {
      video.style.display = "none";
    };
  }
}
