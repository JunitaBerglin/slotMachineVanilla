import * as PIXI from "pixi.js";

export class Loader extends PIXI.Loader {
  constructor(config) {
    super();
    this.config = config;
    this.resources = {};
  }

  preload() {
    for (const asset of this.config.loader) {
      let key = asset.key;
      let url = asset.data.default;
      this.add(key, url);
    }

    return new Promise((resolve) => {
      this.load((loader, resources) => {
        console.log("Loaded resources  häär===>", resources);
        this.resources = resources;
        resolve();
      });
    });
  }
}
