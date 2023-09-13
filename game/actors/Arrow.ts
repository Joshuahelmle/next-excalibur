import { SpriteSheet, Actor, Vector, Shape, CollisionType, Animation, Engine } from "excalibur";
import { Images } from "../resources";
import { ANCHOR_TOP_LEFT, DIRECTION, SCALE, SCALE_2x, TAG } from "@/util/constants";

const arrowSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.arrowImage,
    grid: {
        columns: 1,
        rows: 4,
        spriteWidth: 16,
        spriteHeight: 16,
    }
});


type AnimationConfig = {
    [key in DIRECTION]:  Animation
    
}

const arrowAnimations: AnimationConfig = {
    [DIRECTION.DOWN]: Animation.fromSpriteSheet(arrowSpriteSheet, [0], 100),
    [DIRECTION.UP]: Animation.fromSpriteSheet(arrowSpriteSheet, [1], 100),
    [DIRECTION.LEFT]: Animation.fromSpriteSheet(arrowSpriteSheet, [2], 100),
    [DIRECTION.RIGHT]: Animation.fromSpriteSheet(arrowSpriteSheet, [3], 100),
}

export class Arrow extends Actor {
    public owner : Actor | null = null;
    public msRemaining = 2000;
    constructor(x: number, y: number, public direction: DIRECTION){
        super({
            pos: new Vector(x, y),
            width: 16,
            height: 16,
            scale: SCALE_2x,

        })
        this.addTag(TAG.PLAYER_WEAPON);

        const ARROW_VELOCITY = 300;
        switch(direction){
            case DIRECTION.DOWN:
                this.graphics.use(arrowAnimations[DIRECTION.DOWN]);
                this.vel.y = ARROW_VELOCITY;
                this.pos.y += 4 * SCALE;
                break;
            case DIRECTION.UP:
                this.graphics.use(arrowAnimations[DIRECTION.UP]);
                this.vel.y = -ARROW_VELOCITY;
                break;
            case DIRECTION.LEFT:
                this.graphics.use(arrowAnimations[DIRECTION.LEFT]);
                this.vel.x = -ARROW_VELOCITY;
                this.pos.y += 4 * SCALE;
                break;
            case DIRECTION.RIGHT:
                this.graphics.use(arrowAnimations[DIRECTION.RIGHT]);
                this.vel.x = ARROW_VELOCITY;
                this.pos.y += 4 * SCALE;
                break;
        }
        console.log('Arrow created', this);
    }

    onDamagedSomething(){
        this.kill();
    }

    onPreUpdate(_engine: Engine, delta: number){
        this.msRemaining -= delta;
       
        if(this.msRemaining <= 0){
            this.kill();
        }
    }
}