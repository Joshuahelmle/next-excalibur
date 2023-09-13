import { SpriteSequence } from '@/game/classes/SpriteSequence';
import { ACTIONS, ANIMATION } from '@/util/constants';
import { Actor } from 'excalibur';
import { Engine } from 'excalibur';
import { Player } from './Player';
import { SWORD_SWINGS, Sword } from '../Sword';
import { Arrow } from '../Arrow';
import { NetworkPlayer } from './NetworkPlayer';
export class PlayerActions {
    private engine: Engine;
    constructor(private player: Player | NetworkPlayer) {
        this.engine = player.scene.engine;
    }

    actionSwingSword() {
        const SWORD_SWING_DURATION = 50;
        const { player, engine } = this;

        //Create new sequence
        player.actionAnimation = new SpriteSequence(
            ACTIONS.SWORD,
            [
                {
                    frame: player.animations[player.facing][ANIMATION.SWORD1],
                    duration: SWORD_SWING_DURATION,
                    actorObjectCallback: (swordInstance: Actor) => {
                        if (swordInstance instanceof Sword) {
                            swordInstance.useFrame(SWORD_SWINGS.SWORD_SWING_1, player.facing);
                        }
                    }
                },
                {
                    frame: player.animations[player.facing][ANIMATION.SWORD2],
                    duration: SWORD_SWING_DURATION,
                    actorObjectCallback: (swordInstance: Actor) => {
                        if (swordInstance instanceof Sword) {
                            swordInstance.useFrame(SWORD_SWINGS.SWORD_SWING_2, player.facing);
                        }
                    }
                },
                {
                    frame: player.animations[player.facing][ANIMATION.SWORD2],
                    duration: SWORD_SWING_DURATION * 2,
                    actorObjectCallback: (swordInstance: Actor) => {
                        if (swordInstance instanceof Sword) {
                            swordInstance.useFrame(SWORD_SWINGS.SWORD_SWING_3, player.facing);
                        }
                    }
                },
            ],
            (swordInstance?: Actor) => {
                player.actionAnimation = null;
                swordInstance?.kill();
            }
        )


        //create sword instance
        const sword = new Sword(player.pos.x, player.pos.y, player.facing);
        engine.add(sword);
        sword.owner = player;

        //add sword to player
        player.actionAnimation.actor = sword;

    }

    actionShootArrow() {
        console.log('action shoot arrow');
        const SHOOT_ARROW_SPEED = 155;
        const { player, engine } = this;

        //Create new sequence
        player.actionAnimation = new SpriteSequence(
            ACTIONS.ARROW,
            [
                {
                    frame: player.animations[player.facing][ANIMATION.SWORD1],
                    duration: SHOOT_ARROW_SPEED,
                    actorObjectCallback: (arrowInstance: Actor) => {
                    }
                },
                {
                    frame: player.animations[player.facing][ANIMATION.SWORD2],
                    duration: SHOOT_ARROW_SPEED,
                    actorObjectCallback: (arrowInstance: Actor) => {
                        //Create arrow instance
                        const arrow = new Arrow(player.pos.x, player.pos.y, player.facing);
                        arrow.owner = player;
                        engine.add(arrow);
                    }
                },

            ], () => {
                player.actionAnimation = null;
            }
        );
        player.actionAnimation.actor = player;
    }

    progressThroughActionAnimation(delta: number) {
        const { player } = this;
        if (!player.actionAnimation) return;
        player.vel.x = 0;
        player.vel.y = 0;
        player.actionAnimation.work(delta);
    }

    async flashSeries() {
        const { player } = this;
        player.isPainFlashing = true;
        const FLASH_DURATION = 100;
        for(let i = 0; i <= 4; i++){
            player.graphics.opacity = 0;
            await player.actions.delay(FLASH_DURATION).toPromise();
            player.graphics.opacity = 1;
            await player.actions.delay(FLASH_DURATION).toPromise();
        }
        player.isPainFlashing = false;
    }
}