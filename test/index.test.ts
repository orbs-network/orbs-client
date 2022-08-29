import { create } from '../src/index';

test('Create', async () => {
  const orbsClient = create();
  expect(orbsClient).toBeDefined();
  await orbsClient.init();
  const node = orbsClient.getNextNode();
  expect(node).toBeDefined();
  expect(node?.Name).toBe('Wings Stiftung');
});

test('Next', async () => {
  const orbsClient = create();
  expect(orbsClient).toBeDefined();
  await orbsClient.init();
  let next;
  next = orbsClient.getNextNode();
  expect(orbsClient.nodeIndex).toBe(0);
  next = orbsClient.getNextNode();
  expect(orbsClient.nodeIndex).toBe(1);
  next = orbsClient.getNextNode();
  expect(orbsClient.nodeIndex).toBe(2);
});
