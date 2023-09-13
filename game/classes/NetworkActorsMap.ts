import { EVENTS } from '@/util/constants';
import { on } from 'events';
import { Engine } from 'excalibur';
import { NetworkPlayer } from '../actors/players/NetworkPlayer';

export type StateUpdate = {
    actionType: string,
    x: number,
    y: number,
    velX: number,
    velY: number,
    skinId: string,
    facing: string,
    isInPain: boolean,
    isPainFlashing: boolean,
}
export class NetworkActorsMap {
    private playerMap = new Map<string, NetworkPlayer>();
    constructor(private engine: Engine) {
        this.engine.on(EVENTS.NETWORK_PLAYER_UPDATE, (player) => {
            const p = player as { id: string, data: string };
            if (p.id && p.data) {

                this.onUpdatedPlayer(p.id, p.data);
            }
        });

        this.engine.on(EVENTS.NETWORK_PLAYER_LEAVE, (id) => {
            this.removePlayer(id as string);
        })
    }

    onUpdatedPlayer(id: string, data: string) {
        const [
            actionType,
            x,
            y,
            velX,
            velY,
            skinId,
            facing,
            isInPain,
            isPainFlashing
        ] = data.split('|');

        const stateUpdate = {
            actionType,
            x: Number(x),
            y: Number(y),
            velX: 0,
            velY: 0,
            skinId,
            facing,
            isInPain: isInPain === 'true',
            isPainFlashing: isPainFlashing === 'true',
        }

        if(isInPain){
            stateUpdate.velX = Number(velX);
            stateUpdate.velY = Number(velY);
        }

        let otherPlayer = this.playerMap.get(id);
        if(!otherPlayer){
            otherPlayer = new NetworkPlayer(stateUpdate.x, stateUpdate.y);
            this.playerMap.set(id, otherPlayer);
            this.engine.add(otherPlayer);
        }

        otherPlayer.onStateUpdate(stateUpdate);
    }

    removePlayer(id: string) {
        this.playerMap.get(id)?.kill();
        this.playerMap.delete(id);
    }
}
