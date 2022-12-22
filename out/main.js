import { CANVAS_ID, CANVAS_HEIGHT, ASPECT_RATIO } from "./constants.js";
import { Renderer } from "./rendering/mainRenderer.js";
import { Controller } from "./controller.js";
function main() {
    console.log('WELCOME');
    const canvas = document.getElementById(CANVAS_ID);
    canvas.setAttribute('height', CANVAS_HEIGHT.toString());
    canvas.setAttribute('width', (CANVAS_HEIGHT * ASPECT_RATIO).toString());
    const context = canvas.getContext('2d');
    const renderer = new Renderer(context);
    const controller = new Controller(renderer, canvas);
    renderer.background();
}
main();
