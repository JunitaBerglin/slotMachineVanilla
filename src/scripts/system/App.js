import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import "../../styles/styles.css";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({ resizeTo: window });
document.getElementById("game-container").appendChild(app.view);

import("../game/Config").then(({ Config }) => {
  const loader = new Loader(Config);
  loader
    .preload()
    .then(() => {
      console.log("Resources ==>", loader.resources);

      import("../game/Config")
        .then(({ Config }) => {
          console.log("Config ==>", Config);

          import("../game/Game")
            .then(({ Game }) => {
              const scene = new Game(loader);
              app.stage.addChild(scene.container);
            })
            .catch((error) => {
              console.error("Error loading Game:", error);
            });
        })
        .catch((error) => {
          console.error("Error loading Config:", error);
        });
    })
    .catch((error) => {
      console.error("error loading assets ==>", error);
    });

  function run(config) {
    console.log("Running with config", config);
  }
});
export { app };
