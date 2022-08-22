import { Nodes } from './nodes';
export const create = () => {
    return new Nodes();
}

// sanity
async function sanity() {
    const client = create()
    await client.init();
    const node = client.getRandomNode();
    console.log(node);
}
if (require.main === module) {
    sanity();
}
