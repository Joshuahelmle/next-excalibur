import { DirectionQueue } from "@/game/classes/DirectionQueue"
import { DrawShapeHelper } from "@/game/classes/DrawShapeHelper";
import { SpriteKey, generateCharacterAnimations } from "@/game/classes/characterAnimations";
import { ANCHOR_CENTER, ANIMATION, DIRECTION, EVENTS, SCALE, SCALE_2x } from "@/util/constants"
import { Actor, Vector, Shape, CollisionType, Color, Engine, Keys, Animation, } from "excalibur"
import { PlayerAnimations } from "./PlayerAnimations";
import { SpriteSequence } from "@/game/classes/SpriteSequence";
import { PlayerActions } from "./PlayerActions";
import { NetworkUpdater } from "@/game/classes/NetworkUpdater";


const ACTION_1_KEY = Keys.Z;
const ACTION_2_KEY = Keys.X;

type PainState = {
    msLeft: number,
    painVelX: number,
    painVelY: number,
}

export class Player extends Actor {
    directionQueue = new DirectionQueue();
    facing: DIRECTION = DIRECTION.DOWN;
    animations: Record<DIRECTION, Record<ANIMATION, Animation>>
    playerAnimations: PlayerAnimations | null = null;
    actionAnimation: SpriteSequence | null = null;
    playerActions: PlayerActions | null = null;
    isPainFlashing = false;
    painState : PainState | null = null;
    networkUpdater : NetworkUpdater | null = null;
    constructor(x: number, y: number, private skinID: SpriteKey) {
        super({
            pos: new Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
            collider: Shape.Box(15, 15, ANCHOR_CENTER, new Vector(0, 6)),
            collisionType: CollisionType.Active,
            color: Color.Blue
        })

        this.animations = generateCharacterAnimations(skinID);
        this.graphics.use(this.animations[this.facing][ANIMATION.WALK])
    }

    onInitialize(engine: Engine) {
        new DrawShapeHelper(this);
        this.playerAnimations = new PlayerAnimations(this);
        this.playerActions = new PlayerActions(this);
        this.networkUpdater = new NetworkUpdater(engine, EVENTS.SEND_PLAYER_UPDATE);
    }

    get networkUpdateString() {
        const actionType = this.actionAnimation ? this.actionAnimation.type : "NULL";
        const isInPain = Boolean(this.painState);
        const x = Math.round(this.pos.x);
        const y = Math.round(this.pos.y);
        return `${actionType}|${x}|${y}|${this.vel.x}|${this.vel.y}|${this.skinID}|${this.facing}|${isInPain}|${this.isPainFlashing}`
    }

    takeDamage(){
        if(this.isPainFlashing) return;
        this.isPainFlashing = true;

        //Start pain
        const PAIN_VELOCITY = 150;
        this.painState = {
            msLeft: 200,
            painVelX: this.facing === DIRECTION.LEFT ? PAIN_VELOCITY : -PAIN_VELOCITY,
            painVelY: this.facing === DIRECTION.UP ? PAIN_VELOCITY : -PAIN_VELOCITY,
        }

        this.playerActions?.flashSeries()



    }


    onPreUpdate(engine: Engine, delta: number) {
        this.directionQueue.update(engine);


        //update the action animation
        if(this.actionAnimation){
            this.playerActions?.progressThroughActionAnimation(delta);
        }

        if (!this.actionAnimation) {
            this.onPreUpdateMovement(engine, delta)
            this.onPreUpdateActionKeys(engine, delta)
        }

        //update the animation
        this.playerAnimations?.showRelevantAnimation();

        //update the network updater
        this.networkUpdater?.sendStateUpdate(this.networkUpdateString);
    }

    onPreUpdateMovement(engine: Engine, delta: number) {

        //if in pain state, move in the pain direction
        if(this.painState){
            this.vel.x = this.painState.painVelX;
            this.vel.y = this.painState.painVelY;
        
            this.painState.msLeft -= delta;
            if(this.painState.msLeft <= 0){
                this.painState = null;
            }
         return;
        }


        const keyboard = engine.input.keyboard;
        const WALKING_SPEED = 160;

        this.vel.x = 0;
        this.vel.y = 0;

        if (keyboard.isHeld(Keys.Left)) {
            this.vel.x = -1
        }
        if (keyboard.isHeld(Keys.Right)) {
            this.vel.x = 1
        }
        if (keyboard.isHeld(Keys.Up)) {
            this.vel.y = -1
        }
        if (keyboard.isHeld(Keys.Down)) {
            this.vel.y = 1
        }

        //normalize the velocity vector
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            this.vel = this.vel.normalize().scale(WALKING_SPEED)
        }

        const direction = this.directionQueue.direction
        this.facing = direction ?? this.facing 
    }

    onPreUpdateActionKeys(engine: Engine, delta: number) {
        const keyboard = engine.input.keyboard;
        if (keyboard.wasPressed(ACTION_1_KEY)) {
            this.playerActions?.actionSwingSword();
            return;
        }
        if(keyboard.wasPressed(ACTION_2_KEY)){
            this.playerActions?.actionShootArrow();
            return;
        }

        if(keyboard.wasPressed(Keys.Space)){
        //take damage to debug
        this.takeDamage()
        }
        return;
    }

    changeSkin(skinID: SpriteKey) {
        this.skinID = skinID;
        this.onSkinChange()
    }

    onSkinChange() {
        this.animations = generateCharacterAnimations(this.skinID);
    }
}