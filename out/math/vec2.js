export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    getAdd(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    getSub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
    getScale(factor) {
        return new Vec2(this.x * factor, this.y * factor);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    static distance(f_point, s_point) {
        return f_point.getSub(s_point).length();
    }
    static copy(vec) {
        return new Vec2(vec.x, vec.y);
    }
}
