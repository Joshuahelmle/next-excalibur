import { EVENTS, NETWORK_PORT } from "@/util/constants";
import { Engine } from "excalibur";
import Peer, { DataConnection } from "peerjs";
import { v4 } from 'uuid';

const LOCALHOST_CFG = {
    host: 'localhost',
    key: 'demodemo',
    port: NETWORK_PORT,
    path: '/myApp'
}

const LOCALHOST_URL = `http://localhost:${NETWORK_PORT}`

export class NetworkClient {
    private peerID = `PLAYER_${v4()}`
    private connectionMap = new Map<string, DataConnection>();
    private peer: Peer | null = null;
    constructor(private engine: Engine) {
        this.init();
    }

    async init() {
        this.peer = new Peer(this.peerID, LOCALHOST_CFG);

        this.peer.on('error', (err) => {
            console.error(err.message);
        })

        this.peer.on('connection', async (connection) => {

            connection.on('open', () => {
                this.connectionMap.set(connection.peer, connection);
            });

            connection.on('close', () => {
                this.engine.emit(EVENTS.NETWORK_PLAYER_LEAVE, connection.peer);
                this.connectionMap.delete(connection.peer);
            })

            connection.on('data', data => this.handleIncomingDate(connection, data));

            connection.on('error', err => {
                console.error(err.message);
            })

            window.addEventListener('unload', () => {
                connection.close();
            })


        })


        const otherPeerIds = await this.getOtherPeerIds();
        await timeout(1000);

        otherPeerIds.map(async (id: string) => {
            const connection = this.peer?.connect(id);
            if (connection) {
                connection.on('open', () => {
                    this.connectionMap.set(connection.peer, connection);
                });

                connection.on('close', () => {
                    this.engine.emit(EVENTS.NETWORK_PLAYER_LEAVE, connection.peer);
                    this.connectionMap.delete(connection.peer);
                })

                connection.on('data', data => this.handleIncomingDate(connection, data));

                connection.on('error', err => {
                    console.error(err.message);
                })

                window.addEventListener('unload', () => {
                    connection.close();
                })

             await timeout(1000);
            }
        })
    }

    private handleIncomingDate(connection: DataConnection, data: any) {
        console.log('incoming data', data);
        if (typeof data !== 'string') return;
        this.engine.emit(EVENTS.NETWORK_PLAYER_UPDATE, { id: connection.peer, data });
    }

    async getOtherPeerIds() {
        const response = await fetch(`${LOCALHOST_URL}/myApp/demodemo/peers`);
        const data = await response.json();
        const list = data ?? [];
        return list.filter((id: string) => id !== this.peerID);
    }

    sendUpdate(data: string) {
        this.connectionMap.forEach(connection => {
            connection.send(data);
        })
    }

}

function timeout(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}