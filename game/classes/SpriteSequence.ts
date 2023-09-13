import { Actor , Animation} from 'excalibur';

type FrameAnimation = {
    frame: Animation,
    actorObjectCallback?: (actor: Actor) => void,
    duration: number
}

export class SpriteSequence {
    public currentFrameIndex = 0;
    public currentFrameProgress = 0;
    public isDone = false;
    public onDone: () => void;
    public actor : Actor | null = null;
    constructor(public type: string, public frameAnimations :FrameAnimation[]= [], onDone: (actor?: Actor) => void){
        this.onDone = () => {
            this.isDone = true;
            if(this.actor){
                onDone(this.actor);
            } else onDone();
        }
    }

    get frame(){
        return this.frameAnimations[this.currentFrameIndex].frame;
    }

    work(delta: number){
        if(this.isDone) return;

        const currentFrameDuration = this.frameAnimations[this.currentFrameIndex].duration;

        if(this.currentFrameProgress < currentFrameDuration){
            this.currentFrameProgress += delta;
            return;
        }

        if(this.currentFrameIndex +1 < this.frameAnimations.length){
            this.currentFrameIndex++;
            this.currentFrameProgress = 0;

            //do new Frame callback
            const nextConfig = this.frameAnimations[this.currentFrameIndex];
            if(nextConfig.actorObjectCallback && this.actor){
                nextConfig.actorObjectCallback(this.actor);
            }
            return;
        }
        this.onDone();

    }
}