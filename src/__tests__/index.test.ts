// import { Greeter } from '../index';
// test('My Greeter', () => {
//     expect(Greeter('Carl')).toBe('Hello Carl');
// });

import { create } from '../index';

test('Create', async () => {
    const orbsClient = create();
    expect(orbsClient !== undefined);
    // await orbsClient.init();
    // expect(orbsClient.getNextNode()?.Name === 'NEOPLY');
});