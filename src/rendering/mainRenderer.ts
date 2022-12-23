import { POINT_RADIUS } from "../constants.js";
import { Vec2 } from "../math/vec2.js";
import { Model } from "../model.js";
import { Point } from "../point.js";
import { BACK_COLOR, ELLIPSE_PRECISION } from "./renderingConstants.js";

export class Renderer{
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D){
        this.context = context;
    }

    public drawScene(): void {
        this.background();
        const points = Model.model.getPoints();
        for(const point of points) this.drawPoint(point, (point.selected) ? '#a0b011' : '#000000', true);
        for(let i = 0; i < points.length - 1; i++) this.drawLine(points[i], points[i+1]);
        this.drawBezierCurve();
    }

    public background(color: string = BACK_COLOR): void{
        this.context.fillStyle = color;
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    public drawPoint(point: Point, color: string, fill: boolean): void{
        if(fill){
            this.context.fillStyle = color;
            this.fillEllipse(point.getPosition(), POINT_RADIUS);
        }
        else{
            this.context.strokeStyle = color;
            this.drawEllipse(point.getPosition(), POINT_RADIUS);
        }
    }

    public drawLine(f_point: Point, s_point: Point): void {
        this.context.strokeStyle = '#000000';
        this.context.beginPath();
        this.context.moveTo(f_point.getPosition().x, f_point.getPosition().y);
        this.context.lineTo(s_point.getPosition().x, s_point.getPosition().y);
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

    private drawBezierCurve(): void {
        this.context.strokeStyle = '#000000';
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