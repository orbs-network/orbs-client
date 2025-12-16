import { Client } from '../src/index';
import seed from '../src/seed.json';

test('Client initialization and committee sanity', async () => {
  const seedIP = seed[0]; // Use first seed IP
  const client = new Client(seedIP);

  expect(client.initialized()).toBe(false);

  await client.init();
  // check initialized worked
  expect(client.initialized()).toBe(true);

});

