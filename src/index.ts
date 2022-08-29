import { Nodes } from "./nodes"

export function create() {
    return new Nodes;
}

// debug
// async function sanity() {
//     const client = new Nodes();//create();
//     await client.init();
//     let node;
//     node = client.getNextNode();
//     node = client.getNextNode();
//     node = client.getRandomNode();
// }
// if (require.main === module) {
//     sanity();
// }
