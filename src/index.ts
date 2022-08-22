import { Nodes } from "./nodes";

export const create = async (seed: Array<string> | undefined): Promise<Nodes>{
    const nodes = new Nodes();
    await nodes.init(seed);
    return nodes;
}