import axios from 'axios';
var localSeed = require('seed.json');

interface Node {
    Name: string;
    Ip: number;
    EthAddress: string;
    OrbsAddress: string;
}
///////////////////////////////////
export class Nodes {
    ///////////////////////////////////
    committee: Set<string>;
    topology: Array<Node>;
    ///////////////////////////////////
    nodeIndex: number;
    ///////////////////////////////////
    constructor() {
        this.nodeIndex = 0;
        this.committee = new Set<string>;
        this.topology = [];
    }
    ///////////////////////////////////
    async init(seed: Array<string> | undefined) {
        // cleanup
        this.nodeIndex = 0;
        this.committee.clear();
        this.topology = [];

        if (typeof seed === "undefined") {
            seed = localSeed;
        }
        const payload: any = await this.loadSeed(seed as Array<string>);
        if (!payload) {
            console.error('none of the seed returned a valid status');
            return;
        }
        // assign topology
        this.topology = <Node[]>payload.CurrentTopology;
        // save committee
        for (const member of payload.CurrentCommittee) {
            this.committee.add(member.EthAddress)
        }
    }
    ///////////////////////////////////
    async loadSeed(seed: Array<string>) {
        // fetch status of any of the seed
        for (const s of seed) {
            const url = `http://${s}/services/management-service/status`
            const res: any = await axios.get(url).catch(e => { console.error(`axios exception in seed ${s}:`, e) });
            if (res.Payload)
                return res.Payload;
        }
        return null;
    }
    ///////////////////////////////////
    getNextNode(committeeOnly: Boolean) {

    }
    ///////////////////////////////////
    getRandomNode(committeeOnly: Boolean) {
    }
