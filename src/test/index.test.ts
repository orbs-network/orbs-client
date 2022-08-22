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