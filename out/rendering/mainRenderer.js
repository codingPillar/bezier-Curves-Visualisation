import { POINT_RADIUS } from "../constants.js";
import { Vec2 } from "../math/vec2.js";
import { Model } from "../model.js";
import { BACK_COLOR, ELLIPSE_PRECISION } from "./renderingConstants.js";
export class Renderer {
    constructor(context) {
        this.drawLineState = false;
        // cache the results for reuse
        this.ellipseVertex = [];
        this.context = context;
    }
    drawScene() {
        this.background();
        const points = Model.model.getPoints();
        for (const point of points)
            this.drawPoint(point.getPosition(), (point.selected) ? '#a0b011' : '#000000', true);
        for (let i = 0; i < points.length - 1; i++)
            this.drawLine(points[i].getPosition(), points[i + 1].getPosition());
        this.drawBezierCurve();
        if (this.drawLineState)
            this.drawInterpolatedPoint();
    }
    background(color = BACK_COLOR) {
        this.context.fillStyle = color;
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    drawPoint(position, color, fill) {
        if (fill) {
            this.context.fillStyle = color;
            this.fillEllipse(position, POINT_RADIUS);
        }
        else {
            this.context.strokeStyle = color;
            this.drawEllipse(position, POINT_RADIUS);
        }
    }
    drawLine(f_point, s_point) {
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#000000';
        this.context.beginPath();
        this.context.moveTo(f_point.x, f_point.y);
        this.context.lineTo(s_point.x, s_point.y);
        this.context.stroke();
    }
    drawEllipse(position, radius) {
        this.ellipsePathInit(position, radius);
        this.context.stroke();
    }
    fillEllipse(position, radius) {
        this.ellipsePathInit(position, radius);
        this.context.fill();
    }
    drawInterpolatedPoint() {
        const interpolatedPoints = Model.model.getInterpolationPoints();
        for (let i = 1; i < interpolatedPoints.length; i++) {
            const currentLayer = interpolatedPoints[i];
            for (let i = 0; i < currentLayer.length; i++) {
                this.drawPoint(currentLayer[i], '#ff8888', false);
                if (i < currentLayer.length - 1)
                    this.drawLine(currentLayer[i], currentLayer[i + 1]);
            }
        }
    }
    drawBezierCurve() {
        this.context.lineWidth = 3;
        this.context.strokeStyle = '#a100dd';
        this.initPath(Model.model.getBezierCurve());
        this.context.stroke();
    }
    initPath(points) {
        if (points.length == 0)
            return;
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++)
            this.context.lineTo(points[i].x, points[i].y);
    }
    ellipsePathInit(position, radius) {
        if (this.ellipseVertex.length == 0)
            this.buildPoints();
        this.context.beginPath();
        for (const vertex of this.ellipseVertex)
            this.context.lineTo(radius * vertex.x + position.x, radius * vertex.y + position.y);
    }
    buildPoints() {
        const delta = 2 * Math.PI / (ELLIPSE_PRECISION - 1);
        for (let i = 0; i < ELLIPSE_PRECISION; i++)
            this.ellipseVertex.push(new Vec2(Math.cos(i * delta), Math.sin(i * delta)));
    }
}
