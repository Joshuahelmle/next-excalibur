import { Images } from "@/game/resources";
import { Level } from "./Level";

const INDOOR = {
    mapSprite: Images.indoorImage.toSprite(),
    width: 19,
    height: 22,
    name: 'INDOOR',
    walls : [
        // Top wall, top right area
       { x: 2, y: 2, w: 13, h: 1 },
       { x: 14, y: 3, w: 3, h: 1 },
       { x: 16, y: 4, w: 2, h: 1 },
 
       // Right wall
       { x: 17, y: 5, w: 1, h: 8 },
       { x: 15, y: 12, w: 2, h: 8 },
 
       { x: 2, y: 3, w: 1, h: 9 },
       { x: 3, y: 11, w: 2, h: 9 },
 
       // Bottom
       { x: 4, y: 20, w: 12, h: 1 },
 
       // Inner
       { x: 7, y: 12, w: 5, h: 5 },
    ],
    limits: {
        right: 7,
        left: 8,
        down: 5,
        up: 7
    }
}

const levels = [INDOOR]

export class LevelManager {
    private static _instance: LevelManager;
    public levels : Level[];
    private constructor(){
        this.levels = levels.map(level => new Level(level.mapSprite, level.width, level.height, level.name, level.walls, level.limits))
    }

    

    public static get instance(){
        if(!LevelManager._instance){
            LevelManager._instance = new LevelManager();
        }
        return LevelManager._instance;
    }
}