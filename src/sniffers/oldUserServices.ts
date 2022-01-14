import {getConnector, getUsersAllServicesArray, getUserServicesArrayNewerThen} from '../api';
import {reduceAsync, excludeFromMap, arrayToExistenceMap, parapipe, para, para2, pipe} from '../utils';
import type {Sniffer} from '../helpers';

export const getOldServices: Sniffer = parapipe(
    getConnector,
    para2(
        getUserServicesArrayNewerThen,
        getUsersAllServicesArray,
    ),
    () => ([bashUserServicesArrayNewerThen, bashUsersAllServicesArray]) => pipe(
        bashUsersAllServicesArray,
        para(
            arrayToExistenceMap,
            reduceAsync(async (acc: any, path: any) => {
                console.log(path);
                const paths = await bashUserServicesArrayNewerThen(path);
                return acc.concat(paths.length ? path : []);
            }, []),
        ),
        ([existenceMap, usersNewerServices]) => excludeFromMap(existenceMap)(usersNewerServices),
        Object.keys
    )()
);
