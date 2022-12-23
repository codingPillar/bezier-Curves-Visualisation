import { CURVE_PRECISION, SLIDER_MAX_VALUE, SLIDER_MIN_VALUE } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
import { Point } from "./point.js";

export class Model{
    public static model: Model = new Model();

    private interpolationValue: number = 0.5;
    private points: Point[] = [];

    private constructor(){}

    public addPoint(point: Point): void {
        this.points.push(point)
    }

    public removePoint(): void {
        this.points.pop();
    }

    public getPoints(): Point[] {
        return this.points;
    }

    public updateInterpolation(sliderValue: number): void {
        this.interpolationValue = (sliderValue - SLIDER_MIN_VALUE) / (SLIDER_MAX_VALUE - SLIDER_MIN_VALUE);
    }

    public getInterpolationValue(): number {
        return this.interpolationValue;
    }

    public getPoint(position: Vec2): Point | null {
        for(const point of this.points) if(point.collision(position)) return point;
        return null;
    }

    public getBezierCurve(): Vec2[] {
        if(this.points.length == 0) return []
        const bezierPoints: Vec2[] = [];
        const delta = 1 / CURVE_PRECISION;
        for(let i = 0; i <= CURVE_PRECISION; i++) bezierPoints.push(this.calculateBezier(i * delta));
        return bezierPoints;
    }

    public getInterpolationPoints(): Vec2[][] {
        const points: Vec2[][] = [this.points.map((point: Point) => point.getPosition())];
        let lastLayer: Vec2[] = points[0];
        while(points[points.length - 1].length > 1){
            const newPoints: Vec2[] = [];
            for(let i = 0; i < lastLayer.length - 1; i++) 
                newPoints.push(Model.linearInterpolation(lastLayer[i], lastLayer[i+1], this.interpolationValue));
            points.push(newPoints);
            lastLayer = newPoints;
        }
        return points;
    }

    private calculateBezier(interpolation: number): Vec2 {
        const tempPoints: Vec2[] = this.points.map((point: Point) => Vec2.copy(point.getPosition()));
        while(tempPoints.length > 1){
            for(let i = 0; i < tempPoints.length - 1; i++){
                tempPoints[i] = Model.linearInterpolation(tempPoints[i], tempPoints[i+1], interpolation);
            }
            tempPoints.pop();
        }
        return tempPoints[0];
    }

    private static linearInterpolation(f_point: Vec2, s_point: Vec2, interpolation: number): Vec2{
        return f_point.getScale(1 - interpolation).add(s_point.getScale(interpolation)); 
    }
}