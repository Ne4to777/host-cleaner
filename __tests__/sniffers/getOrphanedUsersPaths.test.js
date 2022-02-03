import {getOrphanedUsersPaths} from '../../src/sniffers';
import defaultConfigs from '../../src/configs';

jest.mock('../../src/helpers', () => ({
    ...jest.requireActual('../../src/helpers'),
    getConnector: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve('')),
}));
jest.mock('../../src/api', () => ({
    ...jest.requireActual('../../src/api'),
    getUsersExistServices: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve([
            './s1/foo',
            './s1/bar',
        ])),
    getUsersAllServicesArray: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve([
            './s1/foo',
            './s1/bar',
            './s2/foo',
            './s2/bar',
        ])),
}));

const host = 'fake.host';

describe('getOrphanedUsersPaths', () => {
    test('fake existing user services and all users services', async () => {
        await expect(
            getOrphanedUsersPaths(defaultConfigs)(host)
        )
            .resolves
            .toStrictEqual(['./s2/foo', './s2/bar']);
    });
});
