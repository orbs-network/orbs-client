import 'isomorphic-fetch';
import { Nodes } from './nodes';
import { Node } from './node';

export interface NodeFilter {
  committeeOnly?: boolean;
  onlineOnly?: boolean;
  teeHardware?: boolean;
}

interface StatusPayload {
  CurrentTopology: {
    Name: string;
    Ip: string;
    Port: number;
    EthAddress: string;
    OrbsAddress: string;
    Website?: string;
    Reputation?: number;
    TeeHardware?: boolean;
  }[];
  CurrentCommittee: {
    EthAddress: string;
    EffectiveStake?: number;
    Weight?: number;
    EnterTime?: number;
    Name?: string;
  }[];
}

export class Client {
  private seedIP: string;
  private allNodes: Node[] = [];
  private initializedFlag: boolean = false;

  constructor(seedIP: string) {
    this.seedIP = seedIP;
  }

  initialized(): boolean {
    return this.initializedFlag;
  }

  async init(): Promise<void> {
    this.initializedFlag = false;
    const payload = await this.loadSeed(this.seedIP);
    if (!payload) {
      throw new Error('Failed to load seed: none of the seed nodes returned a valid status');
    }

    // Create Map of committee members by EthAddress for quick lookup
    const committeeMap = new Map<string, typeof payload.CurrentCommittee[0]>();
    const committeeSet = new Set<string>();
    for (const member of payload.CurrentCommittee) {
      committeeMap.set(member.EthAddress, member);
      committeeSet.add(member.EthAddress);
    }

    // Map CurrentTopology to Node objects, merging data from CurrentCommittee
    this.allNodes = payload.CurrentTopology.map((topologyNode) => {
      const committeeMember = committeeMap.get(topologyNode.EthAddress);
      return new Node({
        name: topologyNode.Name || '',
        ip: topologyNode.Ip || '',
        port: topologyNode.Port || 0,
        website: topologyNode.Website || '',
        guardianAddress: topologyNode.EthAddress || '',
        nodeAddress: topologyNode.OrbsAddress || '',
        reputation: topologyNode.Reputation || 0,
        effectiveStake: committeeMember?.EffectiveStake || 0,
        enterTime: committeeMember?.EnterTime || 0,
        weight: committeeMember?.Weight || 0,
        inCommittee: committeeSet.has(topologyNode.EthAddress),
        teeHardware: topologyNode.TeeHardware || false,
      });
    });

    // Sort by effectiveStake (descending)
    this.allNodes.sort((a, b) => b.effectiveStake - a.effectiveStake);

    this.initializedFlag = true;
  }

  private async loadSeed(seedIP: string): Promise<StatusPayload | null> {
    const url = `http://${seedIP}/services/management-service/status`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (data.Payload) {
        return data.Payload as StatusPayload;
      }
    } catch (e) {
      console.error(`exception in fetch loadSeed ${seedIP}:`, e);
    }
    return null;
  }

  async getNodes(filter?: NodeFilter): Promise<Nodes> {
    let filteredNodes = [...this.allNodes];

    // Apply committeeOnly filter
    if (filter?.committeeOnly === true) {
      filteredNodes = filteredNodes.filter((node) => node.inCommittee === true);
    }

    // Apply teeHardware filter
    if (filter?.teeHardware !== undefined) {
      filteredNodes = filteredNodes.filter((node) => node.teeHardware === filter.teeHardware);
    }

    // Apply onlineOnly filter - fetch status for each node in parallel
    if (filter?.onlineOnly === true) {
      await this.checkNodesOnline(filteredNodes);
      filteredNodes = filteredNodes.filter((node) => node.online === true);
    }

    return new Nodes(filteredNodes);
  }

  private async checkNodesOnline(nodes: Node[]): Promise<void> {
    const timeoutMs = 5000;
    const checkPromises = nodes.map((node) => node.updateStatus(timeoutMs));
    await Promise.all(checkPromises);
  }
}

