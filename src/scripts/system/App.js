import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CSSPlugin } from "gsap/CSSPlugin";
import * as PIXI from "pixi.js";
import { Config } from "../game/Config";
import { Loader } from "./Loader";
import "../../styles/styles.css";

gsap.registerPlugin(PixiPlugin, CSSPlugin);
PixiPlugin.registerPIXI(PIXI);

export class App {
  constructor() {
    this.config = Config;
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xece4e4,
    });

    document.body.appendChild(this.app.view);
  }
}

const appInstance = new App();
const app = appInstance.app;
app.config = appInstance.config;

document.addEventListener("DOMContentLoaded", () => {
  const loader = new Loader(Config);
  loader
    .preload()
    .then(() => {
      if (!loader.resources) {
        throw new Error("Loader resources are not available");
      }

      import("../game/Game")
        .then(({ Game }) => {
          const scene = new Game(loader, app);
          app.stage.addChild(scene.container);
        })
        .catch((error) => {
          console.error("Error loading Game:", error);
        });
    })
    .catch((error) => {
      console.error("Error loading Config:", error);
    });
});

export { appInstance as app };
