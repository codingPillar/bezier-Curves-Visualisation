import { POINT_RADIUS } from "../constants.js";
import { Vec2 } from "../math/vec2.js";
import { Model } from "../model.js";
import { Point } from "../point.js";
import { BACK_COLOR, ELLIPSE_PRECISION } from "./renderingConstants.js";

export class Renderer{
    public drawLineState: boolean = false;
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D){
        this.context = context;
    }

    public drawScene(): void {
        this.background();
        const points = Model.model.getPoints();
        for(const point of points) this.drawPoint(point.getPosition(), (point.selected) ? '#a0b011' : '#000000', true);
        for(let i = 0; i < points.length - 1; i++) this.drawLine(points[i].getPosition(), points[i+1].getPosition());
        this.drawBezierCurve();
        if(this.drawLineState) this.drawInterpolatedPoint();
    }

    public background(color: string = BACK_COLOR): void{
        this.context.fillStyle = color;
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    private drawPoint(position: Vec2, color: string, fill: boolean): void {
        if(fill){
            this.context.fillStyle = color;
            this.fillEllipse(position, POINT_RADIUS);
        }
        else{
            this.context.strokeStyle = color;
            this.drawEllipse(position, POINT_RADIUS);
        }
    }

    public drawLine(f_point: Vec2, s_point: Vec2): void {
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#000000';
        this.context.beginPath();
        this.context.moveTo(f_point.x, f_point.y);
        this.context.lineTo(s_point.x, s_point.y);
        this.context.stroke();
    }

    private drawEllipse(position: Vec2, radius: number): void{
        this.ellipsePathInit(position, radius);
        this.context.stroke();
    }

    private fillEllipse(position: Vec2, radius: number): void {
        this.ellipsePathInit(position, radius);
        this.context.fill();
    }

    private drawInterpolatedPoint(): void {
        const interpolatedPoints: Vec2[][] = Model.model.getInterpolationPoints();
        for(let i = 1; i < interpolatedPoints.length; i++){
            const currentLayer = interpolatedPoints[i];
            for(let i = 0; i < currentLayer.length; i++){
                this.drawPoint(currentLayer[i], '#ff8888', false);
                if(i < currentLayer.length - 1) this.drawLine(currentLayer[i], currentLayer[i+1]);
            }
        }
    }

    private drawBezierCurve(): void {
        this.context.lineWidth = 3;
        this.context.strokeStyle = '#a100dd';
        this.initPath(Model.model.getBezierCurve());
        this.context.stroke();
    }

    private initPath(points: Vec2[]): void{
        if(points.length == 0) return;
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        for(let i = 1; i < points.length; i++) this.context.lineTo(points[i].x, points[i].y);
    }

    private ellipsePathInit(position: Vec2, radius: number) : void {
        if(this.ellipseVertex.length == 0) this.buildPoints();
        this.context.beginPath();
        for(const vertex of this.ellipseVertex) this.context.lineTo(radius * vertex.x + position.x, radius * vertex.y + position.y);
    }

    // cache the results for reuse
    private ellipseVertex: Vec2[] = [];
    private buildPoints(): void {
        const delta = 2 * Math.PI / (ELLIPSE_PRECISION - 1);
        for(let i = 0; i < ELLIPSE_PRECISION; i++)
            this.ellipseVertex.push(new Vec2(Math.cos(i * delta), Math.sin(i * delta)));
    }
}