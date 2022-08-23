// import { Greeter } from '../index';
// test('My Greeter', () => {
//     expect(Greeter('Carl')).toBe('Hello Carl');
// });

import { create } from '../index';

test('Create', async () => {
    const orbsClient = create();
    expect(orbsClient).toBeDefined();
    await orbsClient.init();
    const node = orbsClient.getNextNode();
    expect(node).toBeDefined();
    expect(node?.Name).toBe('Wings Stiftung');
});

test('Generator', async () => {
    const orbsClient = create();
    expect(orbsClient).toBeDefined();
    await orbsClient.init();
    const iter = orbsClient.nextNodeIndex();
    expect(iter.next().value).toBe(0);
    expect(iter.next().value).toBe(1);
    expect(iter.next().value).toBe(2);
});