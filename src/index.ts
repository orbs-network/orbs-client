import { Nodes } from './nodes';
export const create = () => {
  return new Nodes();
};

// sanity
async function sanity() {
  const client = create();
  await client.init();
  let node;
  node = client.getNextNode();
  node = client.getNextNode();
  node = client.getRandomNode();
}
if (require.main === module) {
  sanity();
}
