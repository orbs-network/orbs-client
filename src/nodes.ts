import { Node } from './node';

export class Nodes {
  private nodes: Node[];
  private nodeIndex: number;

  constructor(nodes: Node[]) {
    this.nodes = nodes;
    this.nodeIndex = -1;
  }

  size(): number {
    return this.nodes.length;
  }

  next(): Node | null {
    this.nodeIndex++;
    if (this.nodeIndex >= this.nodes.length) {
      return null;
    }
    return this.nodes[this.nodeIndex];
  }

  get(index: number): Node | null {
    if (index === -1) {
      return this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : null;
    }
    if (index < 0 || index >= this.nodes.length) {
      return null;
    }
    return this.nodes[index];
  }
}
