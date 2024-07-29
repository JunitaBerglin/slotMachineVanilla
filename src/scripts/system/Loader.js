import * as PIXI from "pixi.js";

export class Loader {
  constructor(config) {
    this.config = config;
    this.resources = {};
  }

  preload() {
    return new Promise((resolve, reject) => {
      const loader = new PIXI.Loader();

      this.config.loader.forEach((asset) => {
        loader.add(asset.key, asset.data);
      });

      loader.load((loader, resources) => {
        this.resources = resources;
        resolve();
      });

      loader.onError.add((error) => {
        reject(error);
      });
    });
  }
}
