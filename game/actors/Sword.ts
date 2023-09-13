import { SpriteSheet, Actor, Vector, Shape, CollisionType, Animation, Engine } from "excalibur";
import { Images } from "../resources";
import { ANCHOR_TOP_LEFT, DIRECTION, SCALE, SCALE_2x, TAG } from "@/util/constants";
import { DrawShapeHelper } from "../classes/DrawShapeHelper";

const swordSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.swordImage,
    grid: {
        columns: 3,
        rows: 4,
        spriteWidth: 32,
        spriteHeight: 32,
    }
});

export enum SWORD_SWINGS {
    SWORD_SWING_1 = "SWORD_SWING_1",
    SWORD_SWING_2 = "SWORD_SWING_2",
    SWORD_SWING_3 = "SWORD_SWING_3",
}

type AnimationConfig = {
    [key in DIRECTION]: {
        [key in SWORD_SWINGS]: Animation
    }
}

export class Sword extends Actor {

    public isUsed = false;
    public owner: Actor | null = null;
    public frames: AnimationConfig;
    constructor(x: number, y: number, public direction: DIRECTION) {
        super({
            pos: new Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: Shape.Box(16, 16, ANCHOR_TOP_LEFT, new Vector(-8, -8)),
            collisionType: CollisionType.Passive,
        });
        this.addTag(TAG.PLAYER_WEAPON);

        this.frames = {
            [DIRECTION.DOWN]: {
                [SWORD_SWINGS.SWORD_SWING_1]: Animation.fromSpriteSheet(swordSpriteSheet, [0], 100),
                [SWORD_SWINGS.SWORD_SWING_2]: Animation.fromSpriteSheet(swordSpriteSheet, [1], 100),
                [SWORD_SWINGS.SWORD_SWING_3]: Animation.fromSpriteSheet(swordSpriteSheet, [2], 100),
            },
            [DIRECTION.UP]: {
                [SWORD_SWINGS.SWORD_SWING_1]: Animation.fromSpriteSheet(swordSpriteSheet, [3], 100),
                [SWORD_SWINGS.SWORD_SWING_2]: Animation.fromSpriteSheet(swordSpriteSheet, [4], 100),
                [SWORD_SWINGS.SWORD_SWING_3]: Animation.fromSpriteSheet(swordSpriteSheet, [5], 100),
            },
            [DIRECTION.LEFT]: {
                [SWORD_SWINGS.SWORD_SWING_1]: Animation.fromSpriteSheet(swordSpriteSheet, [6], 100),
                [SWORD_SWINGS.SWORD_SWING_2]: Animation.fromSpriteSheet(swordSpriteSheet, [7], 100),
                [SWORD_SWINGS.SWORD_SWING_3]: Animation.fromSpriteSheet(swordSpriteSheet, [8], 100),
            },
            [DIRECTION.RIGHT]: {
                [SWORD_SWINGS.SWORD_SWING_1]: Animation.fromSpriteSheet(swordSpriteSheet, [9], 100),
                [SWORD_SWINGS.SWORD_SWING_2]: Animation.fromSpriteSheet(swordSpriteSheet, [10], 100),
                [SWORD_SWINGS.SWORD_SWING_3]: Animation.fromSpriteSheet(swordSpriteSheet, [11], 100),
            },
        };

        this.graphics.use(this.frames[this.direction][SWORD_SWINGS.SWORD_SWING_1]);

        //position the sword in the player's hand
        switch (this.direction) {
            case DIRECTION.DOWN:
                this.pos.y += 15 * SCALE;
                this.pos.x -= 5 * SCALE;
                break;
            case DIRECTION.UP:
                this.pos.y -= 6* SCALE;
                this.pos.x += 5 * SCALE;
                break;
            case DIRECTION.LEFT:
                this.pos.x -= 8 * SCALE;
                this.pos.y += 1 * SCALE;
                break;
            case DIRECTION.RIGHT:
                this.pos.x += 8 * SCALE;
                this.pos.y += 1 * SCALE;
                break;
        }

    }

       

    onDamagedSomething() {
        this.isUsed = true;
    }

    useFrame(key: SWORD_SWINGS, direction: DIRECTION) {
        this.graphics.use(this.frames[this.direction][key]);
    }
}