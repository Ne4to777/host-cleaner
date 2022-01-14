import {getConnector, getUsersAllServicesArray, getUsersExistServices, getUsersSymlinksArray} from '../api';
import {arrayToExistenceMap, excludeFromMap, para, para2, parapipe, pipe} from '../utils';
import type {Sniffer} from '../helpers';

export const getOrphanedUsersPaths: Sniffer = parapipe(
    getConnector,
    para2(getUsersExistServices, getUsersAllServicesArray, getUsersSymlinksArray),
    () => ([bashUsersExistServices, bashUsersAllServicesArray, bashUsersSymlinksArray]) => pipe(
        para(
            pipe(
                bashUsersAllServicesArray,
                arrayToExistenceMap
            ),
            pipe(
                bashUsersSymlinksArray,
                bashUsersExistServices
            )
        ),
        ([existenceMap, usersExistServices]) => excludeFromMap(existenceMap)(usersExistServices),
        Object.keys
    )(),
);
