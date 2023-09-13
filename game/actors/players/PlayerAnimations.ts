import { Animation } from 'excalibur';
import { Player } from './Player';
import { ANIMATION } from '@/util/constants';
import { NetworkPlayer } from './NetworkPlayer';
export class PlayerAnimations {
    constructor(private player : Player | NetworkPlayer){}

    showRelevantAnimation(){
        const {player} = this;

        if(player instanceof Player && player.painState || player instanceof NetworkPlayer && player.hasGhostPainState){
            player.graphics.use(player.animations[player.facing][ANIMATION.PAIN]);
            return;
        }


        //check if dedicated action needs animation

        if(player.actionAnimation){
         player.graphics.use(player.actionAnimation.frame);
         return;
        }

        player.graphics.use(player.animations[player.facing][ANIMATION.WALK])


        const currAnimation = player.graphics.current[0].graphic as Animation;
        if(player.vel.x !== 0 || player.vel.y !== 0){
            currAnimation.play();
            return;
        } else {
           currAnimation.pause();
           //currAnimation.goToFrame(0);
        }

    }
}