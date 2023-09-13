import { DIRECTION } from "@/util/constants";
import { Keys, Engine } from "excalibur";

export class DirectionQueue {
    constructor(private heldDirections: DIRECTION[] = []) { }

    get direction() {
        return this.heldDirections[0] ?? DIRECTION.NONE
    }

    add(direction: DIRECTION) {
        if (this.heldDirections.includes(direction)) return
        this.heldDirections.unshift(direction)
    }

    remove(direction: DIRECTION) {
        this.heldDirections = this.heldDirections.filter(d => d !== direction)
    }

    update(engine: Engine) {
        [
            {key: Keys.Left, dir: DIRECTION.LEFT    },
            {key: Keys.Right, dir: DIRECTION.RIGHT  },
            {key: Keys.Up, dir: DIRECTION.UP        },
            {key: Keys.Down, dir: DIRECTION.DOWN    }
        ].forEach(({key, dir}) => {
            if (engine.input.keyboard.wasPressed(key)) {
                this.add(dir)
            } if (engine.input.keyboard.wasReleased(key)){
                this.remove(dir)
            }
        });
    }
}