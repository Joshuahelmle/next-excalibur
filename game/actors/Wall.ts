import { ANCHOR_TOP_LEFT, SCALE, SCALE_2x } from '@/util/constants';
import { Actor, Vector, Shape, CollisionType, Color } from 'excalibur';

export class Wall extends Actor {
    constructor(x: number, y:number, cols: number, rows: number){
        const SIZE= 16;

        super({
            width: cols * SIZE,
            height: rows * SIZE,
            pos: new Vector(x * SIZE * SCALE, y * SIZE * SCALE),
            scale: SCALE_2x,
            anchor: ANCHOR_TOP_LEFT,
            collider: Shape.Box(cols * SIZE, rows * SIZE, ANCHOR_TOP_LEFT),
            collisionType: CollisionType.Fixed,
        })

        this.graphics.opacity = 0.0;
    }
}