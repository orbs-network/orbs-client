import 'isomorphic-fetch';
import { Nodes } from './nodes';
export interface NodeFilter {
    committeeOnly?: boolean;
    onlineOnly?: boolean;
    teeHardware?: boolean;
}
export declare class Client {
    private seedIP;
    private allNodes;
    private initializedFlag;
    constructor(seedIP: string);
    initialized(): boolean;
    init(): Promise<void>;
    private loadSeed;
    getNodes(filter?: NodeFilter): Promise<Nodes>;
    private checkNodesOnline;
}
