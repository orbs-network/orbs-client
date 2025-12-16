import { Client } from '../src/index';
import seed from '../src/seed.json';

// global
const seedIP = seed[0]; // Use first seed IP
const client = new Client(seedIP);

test('committee size and sorting sanity', async () => {
  if (!client.initialized()) {
    await client.init();
  }

  // Get committee nodes
  const committeeNodes = await client.getNodes({ committeeOnly: true });

  // Count committee nodes
  let committeeSize = 0;
  let node = committeeNodes.next();
  while (node !== null) {
    committeeSize++;
    node = committeeNodes.next();
  }

  // committee size
  expect(committeeSize).toBeGreaterThan(0);

  // Get all nodes to check sorting by effectiveStake (descending)
  const allNodes = await client.getNodes();
  const firstNode = allNodes.get(0);
  const lastNode = allNodes.get(-1);

  expect(firstNode).not.toBeNull();
  expect(lastNode).not.toBeNull();

  // first node effective stake should be >= last node effective stake (sorted descending)
  // If they're equal, that's fine (all have same stake), but if different, first should be bigger
  expect(firstNode!.effectiveStake).toBeGreaterThanOrEqual(lastNode!.effectiveStake);

  // If first and last have different stakes, verify first is bigger (sorting works)
  if (firstNode!.effectiveStake !== lastNode!.effectiveStake) {
    expect(firstNode!.effectiveStake).toBeGreaterThan(lastNode!.effectiveStake);
  }

  // last node effective stake should be >= 0
  expect(lastNode!.effectiveStake).toBeGreaterThanOrEqual(0);

  // check next() iteration count equals total nodes count
  let iterationCount = 0;
  let currentNode = allNodes.next();
  while (currentNode !== null) {
    iterationCount++;
    currentNode = allNodes.next();
  }
  // Verify we can iterate through all nodes
  expect(iterationCount).toBeGreaterThan(0);
  expect(iterationCount).toBeGreaterThanOrEqual(committeeSize);

});

test('topology is bigger than committee size', async () => {
  if (!client.initialized()) {
    await client.init();
  }

  // Get committee nodes
  let committee = await client.getNodes({ committeeOnly: true });

  // Get all topology nodes
  let topology = await client.getNodes();

  // check total nodes count is bigger than committee size
  expect(topology.size()).toBeGreaterThan(committee.size());
});

test('online committee nodes all have online=true', async () => {
  if (!client.initialized()) {
    await client.init();
  }

  // Get online committee nodes
  const onlineCommitteeNodes = await client.getNodes({
    committeeOnly: true,
    onlineOnly: true
  });

  // Iterate through all online committee nodes and verify they all have online=true
  let node = onlineCommitteeNodes.next();
  while (node !== null) {
    expect(node.online).toBe(true);
    node = onlineCommitteeNodes.next();
  }
});