import { Node } from './node';
export declare class Nodes {
    private nodes;
    private nodeIndex;
    constructor(nodes: Node[]);
    size(): number;
    next(): Node | null;
    get(index: number): Node | null;
}
