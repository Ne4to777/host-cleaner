import {getOldUserServices} from '../../src/sniffers';
import defaultConfigs from '../../src/configs';

jest.mock('../../src/helpers', () => ({
    ...jest.requireActual('../../src/helpers'),
    getConnector: jest
        .fn()
        .mockImplementation(() => () => () => Promise.resolve('')),
}));
jest.mock('../../src/api', () => ({
    ...jest.requireActual('../../src/api'),
    getHasUserServicesArrayNewerThen: jest
        .fn()
        .mockImplementation(() => () => path => Promise.resolve(/s1/.test(path))),
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

describe('getOldUserServices', () => {
    test('fake all user services', async () => {
        await expect(
            getOldUserServices(defaultConfigs)(host)
        )
            .resolves
            .toStrictEqual([
                './s2/foo',
                './s2/bar',
            ]);
    });
});
