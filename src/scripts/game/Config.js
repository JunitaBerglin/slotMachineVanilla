import { Game } from "./Game";

export const Config = {
  startScene: Game,
  tilesColors: ["blue", "green", "orange", "pink", "red", "yellow"],
  board: {
    rows: 3,
    cols: 3,
  },
  loader: [
    {
      key: "../../assets/blue.png",
      data: require("../../assets/blue.png"),
    },
    {
      key: "../../assets/green.png",
      data: require("../../assets/green.png"),
    },
    {
      key: "../../assets/orange.png",
      data: require("../../assets/orange.png"),
    },
    {
      key: "../../assets/pink.png",
      data: require("../../assets/pink.png"),
    },
    {
      key: "../../assets/red.png",
      data: require("../../assets/red.png"),
    },
    {
      key: "../../assets/yellow.png",
      data: require("../../assets/yellow.png"),
    },
  ],
};
