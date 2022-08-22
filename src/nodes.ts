import axios from 'axios';
import localSeed from './seed.json';
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
    async init(seed?: Array<string>) {
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
            if (res.data?.Payload)
                return res.data.Payload;
        }
        return null;
    }
    ///////////////////////////////////
    getNextNode(committeeOnly: Boolean = true) {
        const startIndex = this.nodeIndex + 1;
        while (this.nodeIndex != startIndex) {
            if (this.nodeIndex > this.topology.length)
                this.nodeIndex = 0;
            // if any node is welcome, or node is in committee- return
            if (!committeeOnly || this.committee.has(this.topology[this.nodeIndex].EthAddress))
                return this.topology[this.nodeIndex];
            // else continue            
            this.nodeIndex++;
        }

    }
    ///////////////////////////////////
    getRandomNode(committeeOnly: Boolean = true) {
        this.topology.length;
        let index = Math.floor(Math.random() * this.topology.length);
        for (let i = 0; i < this.topology.length; ++i) {
            if (index > this.topology.length)
                index = 0;
            // if any node is welcome, or node is in committee- returnx
            if (!committeeOnly || this.committee.has(this.topology[index].EthAddress))
                return this.topology[index];
            index++;
        }
    }
}