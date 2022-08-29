import axios from 'axios';
import 'isomorphic-fetch';
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
      try {
        let response = await fetch(url)
        const data = await response.json();
        if (data.Payload)
          return data.Payload;
      }
      catch (e) {
        console.error(`exception in fetch loadSeed ${s}:`, e);
      }
    }
    return null;
  }
  ///////////////////////////////////
  // a generator function

  ///////////////////////////////////
  getNextNode(committeeOnly: boolean = true) {
    while (true) {
      this.nodeIndex++;
      // out of range
      if (this.nodeIndex > this.topology.length)
        this.nodeIndex = 0;
      // if any node is welcome, or node is in committee- return
      if (!committeeOnly || this.committee.has(this.topology[this.nodeIndex].EthAddress))
        return this.topology[this.nodeIndex];
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


