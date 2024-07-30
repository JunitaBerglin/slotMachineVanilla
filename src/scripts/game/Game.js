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

    this.isSpinning = false;
  }

  createHighlightBox() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xffffff, 1);
    graphics.drawRect(
      this.app.screen.width / 3 - 100,
      this.app.screen.height / 2 - 90,
      600,
      110
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

    this.logAllTileTextures();
  }

  createWheel(x) {
    const wheel = new PIXI.Container();
    wheel.x = x;
    wheel.y = 100;
    wheel.tiles = [];

    const colors = Config.tilesColors;
    const totalTiles = colors.length * 3;

    for (let i = 0; i < totalTiles; i++) {
      const color = colors[i % colors.length];
      const tile = this.createTile(color);
      if (tile) {
        tile.y = i * 100;
        wheel.addChild(tile);
        wheel.tiles.push(tile);
      }
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

    this.app.view.parentElement.appendChild(button);
  }

  createTile(color) {
    const resource = this.loader.resources[color];

    if (!resource) {
      return null;
    }

    const texture = resource.texture;
    if (!texture) {
      console.error(`Texture for color ${color} is null`);
      return null;
    }

    const tile = new PIXI.Sprite(texture);
    tile.anchor.set(0.5);
    tile.x = 50;
    tile.width = 100;
    tile.height = 100;
    tile.color = color;
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

    this.wheels.forEach((wheel, index) => {
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
    const frameY = this.app.screen.height / 2 - 70;
    const frameHeight = 120;
    const frameMiddleY = frameY + frameHeight / 2;

    const middleTiles = [];

    this.wheels.forEach((wheel, wheelIndex) => {
      let closestTile = null;
      let minDistance = Infinity;

      wheel.tiles.forEach((tile, tileIndex) => {
        const tileCenterY = tile.y + wheel.y + tile.height / 2;
        const distance = Math.abs(tileCenterY - frameMiddleY);

        if (distance < minDistance) {
          closestTile = tile;
          minDistance = distance;
        }
      });

      if (closestTile) {
        middleTiles.push(closestTile);
      }
    });

    this.checkJackpot(middleTiles);
  }

  checkJackpot(tiles) {
    const colors = tiles.map((tile) => tile.color);
    const isJackpot = colors.every((color) => color === colors[0]);

    if (isJackpot) {
      this.playWinAnimation();
      console.log("Jackpot!");
    } else {
      console.log("No jackpot");
    }
  }

  logAllTileTextures() {
    this.wheels.forEach((wheel, index) => {
      wheel.tiles.forEach((tile, tileIndex) => {});
    });
  }

  playWinAnimation() {
    const winElement = document.getElementById("container-win");
    if (winElement) {
      winElement.style.display = "block";
      gsap.fromTo(
        winElement,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          repeat: 5,
          yoyo: true,
          onComplete: () => {
            winElement.style.display = "none";
          },
        }
      );
      console.log("Win animation played");
    } else {
      console.error("Element with ID 'container-win' not found");
    }
  }
}
