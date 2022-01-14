import {arrayToExistenceMap, parapipe, para} from '../utils';
import {getAllDismissedUsersCached, getUsersAllArray, getConnector} from '../api';
import type {Sniffer} from '../helpers';

export const getDismissedUsersPaths: Sniffer = parapipe(
    getConnector,
    getUsersAllArray,
    () => bashUsersAllArray => para(
        bashUsersAllArray,
        getAllDismissedUsersCached
    )(),
    ({usersPath}) => ([usersAll, usersDismissed]) => usersAll
        .filter((user: string) => Boolean(arrayToExistenceMap(usersDismissed)[user]))
        .map((user: string) => `${usersPath}/${user}`)
);
