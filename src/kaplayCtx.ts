import kaplay from "kaplay";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";

export const k = kaplay({
    global: false,
    debug: true,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: [155, 231, 255],
});