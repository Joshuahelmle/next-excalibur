import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH, SCALE } from "@/util/constants";

import {Engine} from 'excalibur'

export class Game{
    public instance: Engine
    constructor(canvasElement: HTMLCanvasElement){
        this.instance = new Engine({
            width: VIEWPORT_WIDTH * SCALE,
            height: VIEWPORT_HEIGHT * SCALE,
            fixedUpdateFps: 60,
            antialiasing: false,
            canvasElement
        })
    }
} 



