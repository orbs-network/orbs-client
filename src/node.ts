export class Node {
  name: string;
  ip: string;
  port: number;
  website: string;
  guardianAddress: string;
  nodeAddress: string;
  reputation: number;
  online: boolean;
  effectiveStake: number;
  enterTime: number;
  weight: number;
  inCommittee: boolean;
  updatedTime?: number;
  statusData?: any;
  teeHardware?: boolean;

  constructor(data: {
    name: string;
    ip: string;
    port: number;
    website: string;
    guardianAddress: string;
    nodeAddress: string;
    reputation: number;
    effectiveStake: number;
    enterTime: number;
    weight: number;
    inCommittee: boolean;
    teeHardware?: boolean;
  }) {
    this.name = data.name;
    this.ip = data.ip;
    this.port = data.port;
    this.website = data.website;
    this.guardianAddress = data.guardianAddress;
    this.nodeAddress = data.nodeAddress;
    this.reputation = data.reputation;
    this.online = false; // Will be updated when status is fetched
    this.effectiveStake = data.effectiveStake;
    this.enterTime = data.enterTime;
    this.weight = data.weight;
    this.inCommittee = data.inCommittee;
    this.teeHardware = data.teeHardware || false;
  }

  async updateStatus(timeoutMs: number = 5000): Promise<void> {
    const url = `http://${this.ip}:${this.port}/services/management-service/status`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (response.ok) {
        const statusData = await response.json();
        this.online = true;
        this.statusData = statusData;
        this.updatedTime = Date.now();
      } else {
        this.online = false;
        this.updatedTime = Date.now();
      }
    } catch (e) {
      this.online = false;
      this.updatedTime = Date.now();
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

