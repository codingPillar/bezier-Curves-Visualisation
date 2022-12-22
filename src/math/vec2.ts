export class Vec2{
    public x: number;
    public y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public add(vec: Vec2): Vec2 {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public getAdd(vec: Vec2): Vec2 {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    public sub(vec: Vec2): void{
        this.x -= vec.x;
        this.y -= vec.y;
    }

    public getSub(vec: Vec2): Vec2{
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    public scale(factor: number): void {
        this.x *= factor;
        this.y *= factor;
    }

    public getScale(factor: number): Vec2 {
        return new Vec2(this.x * factor, this.y * factor);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public static distance(f_point: Vec2, s_point: Vec2): number {
        return f_point.getSub(s_point).length();
    }

    public static copy(vec: Vec2): Vec2{
        return new Vec2(vec.x, vec.y);
    }
}