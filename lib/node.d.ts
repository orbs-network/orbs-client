export declare class Node {
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
    });
    updateStatus(timeoutMs?: number): Promise<void>;
    private buildServiceUrl;
    get(path: string, timeoutMs?: number): Promise<Response>;
    post(path: string, body?: any, timeoutMs?: number): Promise<Response>;
}
