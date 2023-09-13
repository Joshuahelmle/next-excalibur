import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH, SCALE, EVENTS } from "@/util/constants";

import {Engine} from 'excalibur'
import { Player } from "./actors/players/Player";
import { Wall } from "./actors/Wall";
import { loader } from "./resources";
import { LevelManager } from "./actors/levels/LevelManager";
import { PlayerCameraStrategy } from "./classes/PlayerCameraStrategy";
import { NetworkClient } from "./classes/NetworkClient";
import { NetworkActorsMap } from "./classes/NetworkActorsMap";

export class Game{
    public instance: Engine
    public player: Player | null = null;
    constructor(canvasElement: HTMLCanvasElement){
        this.instance = new Engine({
            width: VIEWPORT_WIDTH * SCALE,
            height: VIEWPORT_HEIGHT * SCALE,
            fixedUpdateFps: 60,
            antialiasing: false,
            canvasElement
        })
    }

    init(){
        this.instance.add(LevelManager.instance.levels[0]);
        this.player = new Player(100, 100, "RED");
        this.instance.add(this.player);

        this.instance.on('initialize', () => {
            const cameraStrategy = new PlayerCameraStrategy(this.player!, LevelManager.instance.levels[0]);
            this.instance.currentScene.camera.addStrategy(cameraStrategy);
            new NetworkActorsMap(this.instance);
            const peer = new NetworkClient(this.instance);
            this.instance.on(EVENTS.SEND_PLAYER_UPDATE, (update) => peer.sendUpdate(update as string))
        })


        this.instance.start(loader);
    }

    
} 



