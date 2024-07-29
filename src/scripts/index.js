import { app } from "../scripts/system/App";
import { Config } from "./game/Config";
import { Game } from "./game/Game";

window.onload = () => {
  new Game();
};

app.run(Config);
