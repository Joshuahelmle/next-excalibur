import { EVENTS } from "@/util/constants";
import { Engine } from "excalibur";

export class NetworkUpdater {
    prevStr = '';
    constructor(private engine: Engine, private eventType: EVENTS){}

    sendStateUpdate(newState: string){
        if(this.prevStr === newState) return;
        console.log('sending state update', newState);
        this.engine.emit(this.eventType, newState);
        this.prevStr = newState;
    }
}