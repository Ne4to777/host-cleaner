import {connector} from '../../ssh';
import {arrayToExistenceMap, excludeFromMap, pipe} from '../../utils';
import {getUsersAllServicesArray, getUsersExistServices, getUsersSymlinksArray} from '../../helpers';
import type {Sniffer} from '../../helpers';

export const getOrphanedUsersPaths: Sniffer = pipe([
    connector,
    bash => pipe([
        getUsersAllServicesArray(bash),
        arrayToExistenceMap,
        excludeFromMap,
        excludeFromServices => pipe([
            getUsersExistServices,
            bashUsersExistServices => pipe([
                getUsersSymlinksArray(bash),
                bashUsersExistServices,
            ])(),
            excludeFromServices,
        ])(bash),
    ])(),
    Object.keys,
]);
