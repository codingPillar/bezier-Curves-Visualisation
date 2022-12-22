import { ADD_BUTTON_ID, ASPECT_RATIO, CANVAS_HEIGHT, REMOVE_BUTTON_ID } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
import { Model } from "./model.js";
import { Point } from "./point.js";
export class Controller {
    constructor(renderer, canvas) {
        this.currentMouseMoveCallBack = null;
        this.selectedPoint = null;
        this.renderer = renderer;
        this.canvas = canvas;
        this.addCanvasClickEvent();
        this.addButtonListeners();
    }
    addButtonListeners() {
        this.addPointButtonController();
        this.removePointButtonController();
    }
    addPointButtonController() {
        const button = document.getElementById(ADD_BUTTON_ID);
        button.addEventListener('click', (ev) => {
            Model.model.addPoint(new Point(new Vec2(CANVAS_HEIGHT * ASPECT_RATIO / 2, CANVAS_HEIGHT / 2)));
            this.renderer.drawScene();
        });
    }
    removePointButtonController() {
        const button = document.getElementById(REMOVE_BUTTON_ID);
        button.addEventListener('click', (ev) => {
            Model.model.removePoint();
            this.renderer.drawScene();
        });
    }
    addCanvasClickEvent() {
        this.canvas.addEventListener('mousedown', (ev) => {
            const currentPosition = new Vec2(ev.offsetX, ev.offsetY);
            this.selectedPoint = Model.model.getPoint(currentPosition);
            if (!this.selectedPoint)
                return;
            this.addPointMouseMoveEvent(this.selectedPoint);
            this.selectedPoint.selected = true;
        });
        const resetCallBack = (ev) => {
            if (!this.currentMouseMoveCallBack || !this.selectedPoint)
                return;
            this.canvas.removeEventListener('mousemove', this.currentMouseMoveCallBack);
            this.selectedPoint.selected = false;
            this.selectedPoint = null;
            this.currentMouseMoveCallBack = null;
            this.renderer.drawScene();
        };
        this.canvas.addEventListener('mouseup', resetCallBack);
        this.canvas.addEventListener('mouseleave', resetCallBack);
    }
    addPointMouseMoveEvent(point) {
        this.currentMouseMoveCallBack = (ev) => {
            point.move(new Vec2(ev.offsetX, ev.offsetY));
            this.renderer.drawScene();
        };
        this.canvas.addEventListener('mousemove', this.currentMouseMoveCallBack);
    }
}
