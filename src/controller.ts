import { ADD_BUTTON_ID, ASPECT_RATIO, CANVAS_HEIGHT, REMOVE_BUTTON_ID } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
import { Model } from "./model.js";
import { Point } from "./point.js";
import { Renderer } from "./rendering/mainRenderer.js";

export class Controller{
    private renderer: Renderer;
    private canvas: HTMLCanvasElement;

    private currentMouseMoveCallBack : ((ev: MouseEvent) => void) | null = null;
    private selectedPoint: Point | null = null;

    constructor(renderer: Renderer, canvas: HTMLCanvasElement){
        this.renderer = renderer;
        this.canvas = canvas;
        this.addCanvasClickEvent();
        this.addButtonListeners();
    }

    private addButtonListeners(): void {
        this.addPointButtonController();
        this.removePointButtonController();
    }

    private addPointButtonController(): void{
        const button = document.getElementById(ADD_BUTTON_ID) as HTMLButtonElement;
        button.addEventListener('click', (ev: MouseEvent) => {
            Model.model.addPoint(new Point(new Vec2(CANVAS_HEIGHT * ASPECT_RATIO / 2, CANVAS_HEIGHT / 2)));
            this.renderer.drawScene();
        });
    }

    private removePointButtonController(): void {
        const button = document.getElementById(REMOVE_BUTTON_ID) as HTMLButtonElement;
        button.addEventListener('click', (ev: MouseEvent) => {
            Model.model.removePoint();
            this.renderer.drawScene();
        });
    }

    private addCanvasClickEvent(): void {
        this.canvas.addEventListener('mousedown', (ev: MouseEvent) => {
            const currentPosition = new Vec2(ev.offsetX , ev.offsetY);
            this.selectedPoint = Model.model.getPoint(currentPosition);
            if(!this.selectedPoint) return;
            this.addPointMouseMoveEvent(this.selectedPoint);
            this.selectedPoint.selected = true;
        });
        const resetCallBack = (ev: MouseEvent) => {
            if(!this.currentMouseMoveCallBack || !this.selectedPoint) return;
            this.canvas.removeEventListener('mousemove', this.currentMouseMoveCallBack);
            this.selectedPoint.selected = false;
            this.selectedPoint = null;
            this.currentMouseMoveCallBack = null;
            this.renderer.drawScene();
        };
        this.canvas.addEventListener('mouseup', resetCallBack);
        this.canvas.addEventListener('mouseleave', resetCallBack);
    }

    private addPointMouseMoveEvent(point: Point): void {
        this.currentMouseMoveCallBack = (ev: MouseEvent) => {
            point.move(new Vec2(ev.offsetX , ev.offsetY));
            this.renderer.drawScene();
        };
        this.canvas.addEventListener('mousemove', this.currentMouseMoveCallBack);
    }

}