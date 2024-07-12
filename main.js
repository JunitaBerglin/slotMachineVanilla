/*
    Hello and welcome to your 1 523'rd work assignment!

    Today we are going to make a 3 reel slot that starts, spins and stops.
    And if we are lucky enough to land the same symbol on all 3 reels, we win! WOHO!

    * Reels should start, spin and stop on random positions/symbols
    * If all 3 reels stops on the same symbol, play a win celebration.
    * You can use the WinsweepBox[00-25] sequence for win animation.
    * All available symbols can be found within assets.json

    The assignment will be judged with the following points in mind:
    * Creativity
    * Structure
    * Complexity
    * Look'n'feel

    Spritesheets can be created from https://www.codeandweb.com/tp-online
    Example on how to get started with sprites can be found in the run() method.

    If you have any questions, feel free to contact us at devlead@jaderabbitstudio.com
*/

const app = new PIXI.Application({
    width: 800,
    height: 500,
    backgroundColor: 0x1099bb,
    antialias: true,
    transparent: false,
    resolution: 1
});

window.addEventListener("load", async () => {
    await loadAssets();
    document.body.appendChild(app.view);
    await run();
});

async function loadAssets() {
    const assetPromises = [];
    assetPromises.push(PIXI.Assets.load("assets.json"));
    await Promise.all(assetPromises);
}

async function run() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from("High3.png"));
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    app.stage.addChild(sprite);

    app.ticker.add(function (delta) {
        sprite.rotation += 0.01 * delta;
    });
}

