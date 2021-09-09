import {
    connector,
    getUsersAllServicesArray,
    getUserServicesArrayNewerThen
} from '../api';
import {reduceAsync, pipe, T, C, excludeFromMap, arrayToExistenceMap, parallel} from '../utils';
import type {Sniffer} from '../helpers';
import configs from '../configs';

export const getOldServices: Sniffer = pipe([
    connector,
    parallel([
        getUserServicesArrayNewerThen(configs.daysExpired || Infinity),
        C(getUsersAllServicesArray)(),
    ]),
    T((getUserServices: any) => parallel([
        arrayToExistenceMap,
        reduceAsync(async (acc: any, path: any) => {
            console.log(path);
            const paths = await getUserServices(path);
            return acc.concat(paths.length ? path : []);
        }, []),
    ])),
    T(excludeFromMap),
    Object.keys
]);
