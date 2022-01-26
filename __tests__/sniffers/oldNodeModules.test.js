import {getOldNodeModulesPaths} from '../../src/sniffers';
import defaultConfigs from '../../src/configs';

jest.mock('../../src/api', () => ({
    ...jest.requireActual('../../src/api'),
    getConnector: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve('')),
    getUserServiceNodeModulesPath: jest
        .fn()
        .mockImplementation(() => () => path => Promise.resolve([`${path}/node_modules`])),
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

describe('getOldNodeModulesPaths', () => {
    test('fake all user node_modules and all users services', async () => {
        await expect(
            getOldNodeModulesPaths(defaultConfigs)(host)
        )
            .resolves
            .toStrictEqual([
                './s1/foo/node_modules',
                './s1/bar/node_modules',
                './s2/foo/node_modules',
                './s2/bar/node_modules',
            ]);
    });
});
