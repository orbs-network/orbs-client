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
  topology: Node[];
  ///////////////////////////////////
  nodeIndex: number;
  ///////////////////////////////////
  constructor() {
    this.nodeIndex = -1;
    this.committee = new Set<string>();
    this.topology = [];
  }
  ///////////////////////////////////
  async init(seed?: string[]) {
    // cleanup
    this.nodeIndex = -1;
    this.committee.clear();
    this.topology = [];

    if (typeof seed === 'undefined') {
      seed = localSeed;
    }
    const payload: any = await this.loadSeed(seed as string[]);
    if (!payload) {
      console.error('none of the seed returned a valid status');
      return;
    }
    // assign topology
    this.topology = payload.CurrentTopology as Node[];
    // save committee
    for (const member of payload.CurrentCommittee) {
      this.committee.add(member.EthAddress);
    }
  }
  ///////////////////////////////////
  async loadSeed(seed: string[]) {
    // fetch status of any of the seed
    for (const s of seed) {
      const url = `http://${s}/services/management-service/status`;
      const res: any = await axios.get(url).catch((e) => {
        console.error(`axios exception in seed ${s}:`, e);
      });
      if (res.data?.Payload) return res.data.Payload;
    }
    return null;
  }
  ///////////////////////////////////
  // a generator function
  *nextNodeIndex(): IterableIterator<number> {
    while (true) {
      this.nodeIndex++;
      if (this.nodeIndex > this.topology.length) this.nodeIndex = 0;

      yield this.nodeIndex;
    }
  }
  ///////////////////////////////////
  getNextNode(committeeOnly: boolean = true) {
    // const startIndex = this.nodeIndex;
    // let index;
    // while ((index = this.nextNodeIndex()) !== startIndex) {
    for (const index of this.nextNodeIndex()) {
      // if any node is welcome, or node is in committee- return
      if (!committeeOnly || this.committee.has(this.topology[index].EthAddress)) return this.topology[index];
    }
  }
  ///////////////////////////////////
  getRandomNode(committeeOnly: boolean = true) {
    let index = Math.floor(Math.random() * this.topology.length);
    while (true) {
      index++;
      if (index > this.topology.length) index = 0;
      // if any node is welcome, or node is in committee- return
      if (!committeeOnly || this.committee.has(this.topology[index].EthAddress)) return this.topology[index];
    }
  }
}
