import {getDismissedUsersPaths} from '../../src/sniffers';
import defaultConfigs from '../../src/configs';

jest.mock('../../src/helpers', () => ({
    ...jest.requireActual('../../src/helpers'),
    getConnector: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve(['foo', 'bar', 'baz'].join('\n'))),
}));
jest.mock('../../src/api', () => ({
    ...jest.requireActual('../../src/api'),
   getAllDismissedUsersCached: jest
        .fn()
        .mockImplementation(() => Promise.resolve(['foo', 'bar'])),
}));

const host = 'fake.host';

describe('getDismissedUsersPaths', () => {
    test('fake host users and dismissed users', async () => {
        await expect(
            getDismissedUsersPaths(defaultConfigs)(host)
        )
            .resolves
            .toStrictEqual([`${defaultConfigs.usersPath}/foo`, `${defaultConfigs.usersPath}/bar`]);
    });
});
