import { Vector, CameraStrategy, clamp } from 'excalibur';
import { Level } from '../actors/levels/Level';
import { Player } from './../actors/players/Player';
import { SCALE, TILE_SIZE } from '@/util/constants';
export class PlayerCameraStrategy implements CameraStrategy<Player>{
    position : Vector

    constructor(public target: Player, private level: Level){
        this.position = new Vector(this.target.pos.x, this.target.pos.y);
    }

    action() {
        const SPEED = 0.08;
        const distance = this.position.distance(this.target.pos);
        if(distance > 2) {
            this.position.x = this.lerp(this.position.x, this.target.pos.x, SPEED);
            this.position.y = this.lerp(this.position.y, this.target.pos.y, SPEED);
        }

        //Level Limits
        const { right, left, up, down} = this.level.limits;
        const RLimit = (this.level.tileWidth - right) * SCALE * TILE_SIZE;
        const LLimit = left * SCALE * TILE_SIZE;
        const ULimit = up * SCALE * TILE_SIZE;
        const DLimit = (this.level.tileHeight - down) * SCALE * TILE_SIZE;
        this.position.x = clamp(this.position.x, LLimit, RLimit);
        this.position.y = clamp(this.position.y, ULimit, DLimit);


        return this.position;
    }

    lerp(currentVal: number, destinationVal: number, speed: number){
        return currentVal * (1 - speed) + destinationVal  * speed;
    }
}