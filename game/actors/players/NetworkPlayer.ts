import { SpriteSequence } from "@/game/classes/SpriteSequence";
import { SpriteKey, generateCharacterAnimations } from "@/game/classes/characterAnimations";
import { ACTIONS, ANIMATION, DIRECTION, SCALE_2x } from "@/util/constants";
import { Actor, Vector, Animation, Engine } from "excalibur";
import { PlayerActions } from "./PlayerActions";
import { PlayerAnimations } from "./PlayerAnimations";
import { StateUpdate } from "@/game/classes/NetworkActorsMap";

export class NetworkPlayer extends Actor {

    public skinID: SpriteKey = "BLUE";
    facing: DIRECTION = DIRECTION.DOWN;
    animations: Record<DIRECTION, Record<ANIMATION, Animation>>
    playerAnimations: PlayerAnimations | null = null;
    actionAnimation: SpriteSequence | null = null;
    playerActions: PlayerActions | null = null;
    isPainFlashing = false;
    hasGhostPainState = false;
    walkingMsLeft = 0;
    constructor(x: number, y: number) {
        super({
            pos: new Vector(x, y),
            width: 32,
            height: 32,
            scale: SCALE_2x,
        });
        this.animations = generateCharacterAnimations(this.skinID);
    }

    onInitialize(engine: Engine) {
        this.playerAnimations = new PlayerAnimations(this);
        this.playerActions = new PlayerActions(this);
    }

    changeSkin(skinID: SpriteKey) {
        this.skinID = skinID;
        this.onSkinChange()
    }

    onSkinChange() {
        this.animations = generateCharacterAnimations(this.skinID);
    }

    onStateUpdate(newUpdate: StateUpdate) {
        if (newUpdate.actionType === ACTIONS.SWORD && !this.actionAnimation) {
            this.playerActions?.actionSwingSword();
        }
        if (newUpdate.actionType === ACTIONS.ARROW && !this.actionAnimation) {
            this.playerActions?.actionShootArrow();
        }

        const oldX = this.pos.x;
        const oldY = this.pos.y;
        this.pos.x = newUpdate.x;
        this.pos.y = newUpdate.y;
        const hasPosDelta = oldX !== newUpdate.x || oldY !== newUpdate.y;
        if (hasPosDelta) {
            this.walkingMsLeft = 100;
        }

        this.facing = newUpdate.facing as DIRECTION ?? this.facing;
        this.hasGhostPainState = newUpdate.isInPain;

        const wasPainFlashing = this.isPainFlashing;
        if(!wasPainFlashing && newUpdate.isPainFlashing){
            this.playerActions?.flashSeries();
        }

        if(this.skinID !== newUpdate.skinId as SpriteKey){
            this.changeSkin(newUpdate.skinId as SpriteKey)
        }
    }

    onPreUpdate(engine: Engine, delta: number) {


        //update the action animation
        if(this.actionAnimation){
            this.playerActions?.progressThroughActionAnimation(delta);
        }

        //walking
        if(this.walkingMsLeft > 0){
            this.walkingMsLeft -= delta;
        }
       
        //update the animation
        this.playerAnimations?.showRelevantAnimation();

    }
}