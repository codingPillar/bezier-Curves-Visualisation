import { CURVE_PRECISION, DELTA } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
export class Model {
    constructor() {
        this.points = [];
        this.interpolationValue = 0;
    }
    addPoint(point) {
        this.points.push(point);
    }
    removePoint() {
        this.points.pop();
    }
    getPoints() {
        return this.points;
    }
    updateInterpolation(increase) {
        if (increase)
            this.interpolationValue += DELTA;
        else
            this.interpolationValue -= DELTA;
    }
    getPoint(position) {
        for (const point of this.points)
            if (point.collision(position))
                return point;
        return null;
    }
    getBezierCurve() {
        if (this.points.length == 0)
            return [];
        const bezierPoints = [];
        const delta = 1 / CURVE_PRECISION;
        for (let i = 0; i <= CURVE_PRECISION; i++)
            bezierPoints.push(this.calculateBezier(i * delta));
        return bezierPoints;
    }
    calculateBezier(interpolation) {
        const tempPoints = this.points.map((point) => Vec2.copy(point.getPosition()));
        while (tempPoints.length > 1) {
            for (let i = 0; i < tempPoints.length - 1; i++) {
                tempPoints[i] = this.linearInterpolation(tempPoints[i], tempPoints[i + 1], interpolation);
            }
            tempPoints.pop();
        }
        return tempPoints[0];
    }
    linearInterpolation(f_point, s_point, interpolation) {
        return f_point.getScale(1 - interpolation).add(s_point.getScale(interpolation));
    }
}
Model.model = new Model();
