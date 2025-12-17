import { Client } from '../src/index';
import seed from '../src/seed.json';

// global
const seedIP = seed[0]; // Use first seed IP
const client = new Client(seedIP);

test('first committee node has all fields populated', async () => {
  if (!client.initialized()) {
    await client.init();
  }

  // Get committee nodes
  const committeeNodes = await client.getNodes({ committeeOnly: true });
  const firstNode = committeeNodes.get(0);

  expect(firstNode).not.toBeNull();

  // Verify all fields are populated
  expect(firstNode!.name).toBeTruthy();
  expect(firstNode!.name.length).toBeGreaterThan(0);

  expect(firstNode!.ip).toBeTruthy();
  expect(firstNode!.ip.length).toBeGreaterThan(0);

  expect(firstNode!.port).toBeGreaterThanOrEqual(0);

  expect(firstNode!.website).toBeDefined(); // Can be empty string, but should be defined

  expect(firstNode!.guardianAddress).toBeTruthy();
  expect(firstNode!.guardianAddress.length).toBeGreaterThan(0);

  expect(firstNode!.nodeAddress).toBeTruthy();
  expect(firstNode!.nodeAddress.length).toBeGreaterThan(0);

  expect(firstNode!.reputation).toBeGreaterThanOrEqual(0);

  expect(firstNode!.effectiveStake).toBeGreaterThanOrEqual(0);

  expect(firstNode!.enterTime).toBeGreaterThan(0); // Should be a valid timestamp

  expect(firstNode!.weight).toBeGreaterThanOrEqual(0);

  expect(firstNode!.inCommittee).toBe(true); // Should be true since we filtered by committeeOnly

  expect(firstNode!.teeHardware).toBeDefined(); // Should be boolean (true or false)
});

test('node.get RPC call', async () => {
  if (!client.initialized()) {
    await client.init();
  }

  // Get first committee node
  const committeeNodes = await client.getNodes({ committeeOnly: true });
  const node = committeeNodes.get(0);

  expect(node).not.toBeNull();

  // Test GET RPC call to signer/status endpoint
  const response = await node!.get('signer/status');

  expect(response).toBeDefined();

  // Response may or may not be ok depending on node availability
  // But we should get a response object
  expect(response.status).toEqual(200);

  // If response is ok, verify we can parse JSON
  if (response.ok) {
    const data = await response.json();
    expect(data).toBeDefined();
  }
});

