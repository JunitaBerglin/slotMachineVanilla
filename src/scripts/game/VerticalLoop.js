import { gsap } from "gsap";

export function verticalLoop(items, config) {
  items = gsap.utils.toArray(items);
  if (items.length === 0) {
    console.error("No items provided for vertical loop");
    return;
  }

  config = config || {};
  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: true,
    defaults: { ease: "none" },
  });

  let length = items.length,
    totalHeight = items.reduce((acc, item) => acc + item.height, 0),
    curY = 0;

  items.forEach((item) => {
    gsap.set(item, { y: curY });
    curY += item.height;
  });

  tl.to(items, {
    y: `-=${totalHeight}`,
    duration: totalHeight / (config.speed || 100),
    ease: "none",
    repeat: -1,
    modifiers: {
      y: (y) => {
        y = parseFloat(y);
        return y % totalHeight;
      },
    },
  });

  return tl;
}
