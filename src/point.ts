import { POINT_RADIUS } from "./constants.js";
import { Vec2 } from "./math/vec2.js";

export class Point{
    private position: Vec2;
    public selected: boolean = false;

    constructor(position: Vec2){
        this.position = position;
    }

    public translate(translation: Vec2){
        this.position.add(translation);
    }

    public move(position: Vec2){
        this.position = position;
    }

    public getPosition(): Vec2{
        // should not return reference to object, but rather only useful coordinates
        return this.position;
    }

    public collision(position: Vec2): boolean {
        return Vec2.distance(this.position, position) < POINT_RADIUS;
    }
}