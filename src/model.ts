import { CURVE_PRECISION, DELTA } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
import { Point } from "./point.js";

export class Model{
    public static model: Model = new Model();

    private points: Point[] = [];
    private interpolationValue: number = 0;

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

    public updateInterpolation(increase: boolean): void {
        if(increase) this.interpolationValue += DELTA;
        else this.interpolationValue -= DELTA;
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

    private calculateBezier(interpolation: number): Vec2 {
        const tempPoints: Vec2[] = this.points.map((point: Point) => Vec2.copy(point.getPosition()));
        while(tempPoints.length > 1){
            for(let i = 0; i < tempPoints.length - 1; i++){
                tempPoints[i] = this.linearInterpolation(tempPoints[i], tempPoints[i+1], interpolation);
            }
            tempPoints.pop();
        }
        return tempPoints[0];
    }

    private linearInterpolation(f_point: Vec2, s_point: Vec2, interpolation: number): Vec2{
        return f_point.getScale(1 - interpolation).add(s_point.getScale(interpolation)); 
    }
}