import { Engine } from 'excalibur';
import { ANCHOR_TOP_LEFT, SCALE_2x } from '@/util/constants';
import { Actor, Sprite } from 'excalibur';
import {Wall} from '../Wall';
export class Level extends Actor {

    constructor(private sprite: Sprite, public tileWidth: number, public tileHeight: number, public levelName: string, public walls: {x: number, y: number, w: number, h: number}[], public limits : {right: number, left: number, down: number, up: number}){
        super({
            x: 0,
            y: 0,
            scale: SCALE_2x,
            anchor: ANCHOR_TOP_LEFT
        });
        this.graphics.use(this.sprite);
    }

    onInitialize(engine: Engine){
        this.walls.map(({x,y,w,h}) => new Wall(x,y,w,h)).forEach(wall => engine.add(wall));
    }
}