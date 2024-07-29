import { Game } from "./Game";

export const Config = {
  startScene: Game,
  tilesColors: ["blue", "green", "orange", "pink", "red", "yellow"],
  board: {
    rows: 3,
    cols: 6,
  },
  loader: [
    {
      key: "blue",
      data: require("../../assets/blue.png").default,
    },
    {
      key: "green",
      data: require("../../assets/green.png").default,
    },
    {
      key: "orange",
      data: require("../../assets/orange.png").default,
    },
    {
      key: "pink",
      data: require("../../assets/pink.png").default,
    },
    {
      key: "red",
      data: require("../../assets/red.png").default,
    },
    {
      key: "yellow",
      data: require("../../assets/yellow.png").default,
    },
  ],
};
