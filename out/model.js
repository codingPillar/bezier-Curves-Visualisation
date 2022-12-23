import { CURVE_PRECISION, SLIDER_MAX_VALUE, SLIDER_MIN_VALUE } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
export class Model {
    constructor() {
        this.interpolationValue = 0.5;
        this.points = [];
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
    updateInterpolation(sliderValue) {
        this.interpolationValue = (sliderValue - SLIDER_MIN_VALUE) / (SLIDER_MAX_VALUE - SLIDER_MIN_VALUE);
    }
    getInterpolationValue() {
        return this.interpolationValue;
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
    getInterpolationPoints() {
        const points = [this.points.map((point) => point.getPosition())];
        let lastLayer = points[0];
        while (points[points.length - 1].length > 1) {
            const newPoints = [];
            for (let i = 0; i < lastLayer.length - 1; i++)
                newPoints.push(Model.linearInterpolation(lastLayer[i], lastLayer[i + 1], this.interpolationValue));
            points.push(newPoints);
            lastLayer = newPoints;
        }
        return points;
    }
    calculateBezier(interpolation) {
        const tempPoints = this.points.map((point) => Vec2.copy(point.getPosition()));
        while (tempPoints.length > 1) {
            for (let i = 0; i < tempPoints.length - 1; i++) {
                tempPoints[i] = Model.linearInterpolation(tempPoints[i], tempPoints[i + 1], interpolation);
            }
            tempPoints.pop();
        }
        return tempPoints[0];
    }
    static linearInterpolation(f_point, s_point, interpolation) {
        return f_point.getScale(1 - interpolation).add(s_point.getScale(interpolation));
    }
}
Model.model = new Model();
