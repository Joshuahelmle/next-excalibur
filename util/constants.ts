import { Vector } from "excalibur";

export const VIEWPORT_WIDTH = 160 + 48;
export const VIEWPORT_HEIGHT = 144 + 48;

export const TILE_SIZE = 16;
export const SCALE = 2;
export const SCALE_2x = new Vector(SCALE, SCALE);

export const ANCHOR_CENTER = new Vector(0.5, 0.5);
export const ANCHOR_TOP_LEFT = new Vector(0, 0);

export const NETWORK_PORT = 9002;

export enum DIRECTION {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    UP = "UP",
    DOWN = "DOWN",
}

export enum ANIMATION {
    WALK = "WALK",
    SWORD1 = "SWORD1",
    SWORD2 = "SWORD2",
    PAIN = "PAIN"
}

export enum ACTIONS {
    SWORD = "SWORD",
    ARROW = "ARROW",
}

export enum EVENTS {
    SEND_PLAYER_UPDATE = "SEND_PLAYER_UPDATE",
    SEND_MONSTER_UPDATE = "SEND_MONSTER_UPDATE",
    INITIAL_DATA_REQUEST = "INITIAL_DATA_REQUEST",
    NETWORK_PLAYER_UPDATE = "NETWORK_PLAYER_UPDATE",
    NETWORK_PLAYER_LEAVE = "NETWORK_PLAYER_LEAVE",
    NETWORK_MONSTER_UPDATE = "NETWORK_MONSTER_UPDATE",
}

export enum TAG {
    ANY_PLAYER = "ANY_PLAYER",
    MONSTER_ROAM_POINT = "MONSTER_ROAM_POINT",
    PLAYER_WEAPON = "PLAYER_WEAPON",
    DAMAGES_PLAYER = "DAMAGES_PLAYER",
}