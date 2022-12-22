import { POINT_RADIUS } from "./constants.js";
import { Vec2 } from "./math/vec2.js";
export class Point {
    constructor(position) {
        this.selected = false;
        this.position = position;
    }
    translate(translation) {
        this.position.add(translation);
    }
    move(position) {
        this.position = position;
    }
    getPosition() {
        // should not return reference to object, but rather only useful coordinates
        return this.position;
    }
    collision(position) {
        return Vec2.distance(this.position, position) < POINT_RADIUS;
    }
}
