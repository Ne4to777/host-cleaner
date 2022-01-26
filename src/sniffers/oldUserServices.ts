import {
    getConnector,
    getHasUserServicesArrayNewerThen,
    getUsersAllServicesArray,
} from '../api';
import {reduceAsync, excludeFromMap, arrayToExistenceMap, parapipe, para, para2, pipe, log} from '../utils';
import type {Sniffer} from '../helpers';

export const getOldUserServices: Sniffer = parapipe(
    getConnector,
    para2(
        getHasUserServicesArrayNewerThen,
        getUsersAllServicesArray,
    ),
    () => ([bashUserServicesArrayNewerThen, bashUsersAllServicesArray]) => pipe(
        bashUsersAllServicesArray,
        para(
            arrayToExistenceMap,
            reduceAsync(async (acc: any, path: any) => {
                log(path);
                const hasPaths = await bashUserServicesArrayNewerThen(path);
                return acc.concat(hasPaths ? path : []);
            }, []),
        ),
        ([existenceMap, usersNewerServices]) => excludeFromMap(existenceMap)(usersNewerServices),
        Object.keys,
    )(),
);
