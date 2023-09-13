import { SpriteSheet, Animation } from "excalibur";
import { Images } from "../resources";
import { ANIMATION, DIRECTION } from "@/util/constants";

const WALK_ANIMATION_SPEED = 150;
const charSpriteSheetConfig = {
    columns: 10,
    rows: 10,
    spriteWidth: 32,
    spriteHeight: 32
};

const redSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.redSheetImage,
    grid: charSpriteSheetConfig
});

const blueSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.blueSheetImage,
    grid: charSpriteSheetConfig
});

const graySpriteSheet = SpriteSheet.fromImageSource({
    image: Images.graySheetImage,
    grid: charSpriteSheetConfig
});

const yellowSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.yellowSheetImage,
    grid: charSpriteSheetConfig
});

export type SpriteKey = keyof typeof ALL_SPRITES;

export const ALL_SPRITES = {
    RED: redSpriteSheet,
    BLUE: blueSpriteSheet,
    GRAY: graySpriteSheet,
    YELLOW: yellowSpriteSheet,
}

type AnimationConfig = {
    [key in DIRECTION]: {
        [key in ANIMATION]: [number[], number]
    }
}

const ANIMATION_CONFIGS : AnimationConfig = {
    [DIRECTION.DOWN]: {
        [ANIMATION.WALK] : [[0,1], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD1] : [[2], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD2] : [[3], WALK_ANIMATION_SPEED],
        [ANIMATION.PAIN] : [[4], WALK_ANIMATION_SPEED],
    },
    [DIRECTION.UP]: {
        [ANIMATION.WALK] : [[10,11], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD1] : [[12], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD2] : [[13], WALK_ANIMATION_SPEED],
        [ANIMATION.PAIN] : [[14], WALK_ANIMATION_SPEED],
    },
    [DIRECTION.LEFT]: {
        [ANIMATION.WALK] : [[20,21], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD1] : [[22], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD2] : [[23], WALK_ANIMATION_SPEED],
        [ANIMATION.PAIN] : [[24], WALK_ANIMATION_SPEED],
    },
    [DIRECTION.RIGHT]: {
        [ANIMATION.WALK] : [[30,31], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD1] : [[32], WALK_ANIMATION_SPEED],
        [ANIMATION.SWORD2] : [[33], WALK_ANIMATION_SPEED],
        [ANIMATION.PAIN] : [[34], WALK_ANIMATION_SPEED],
    },
}

export const generateCharacterAnimations = (spriteID: SpriteKey) => {
    const sheet = ALL_SPRITES[spriteID];
    const payload = {} as Record<DIRECTION, Record<ANIMATION, Animation>>;
    for(const [dir, animations] of Object.entries(ANIMATION_CONFIGS)){
        payload[dir as DIRECTION] = {} as Record<ANIMATION, Animation>;
        for(const [anim, [frames, speed]] of Object.entries(animations)){
            payload[dir as DIRECTION][anim as ANIMATION] = Animation.fromSpriteSheet(sheet, [...frames], speed);
        }
    }
    return payload;
}