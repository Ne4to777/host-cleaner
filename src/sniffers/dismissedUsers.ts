import {arrayToExistenceMap, parapipe, para, pipe} from '../utils';
import {getAllDismissedUsersCached, getUsersAllArray, getConnector} from '../api';
import type {Sniffer} from '../helpers';

export const getDismissedUsersPaths: Sniffer = parapipe(
    getConnector,
    getUsersAllArray,
    () => bashUsersAllArray => para(
        bashUsersAllArray,
        pipe(getAllDismissedUsersCached, arrayToExistenceMap),
    )(),
    ({usersPath}) => ([usersAll, usersDismissedMap]) => usersAll
        .filter((user: string) => Boolean(usersDismissedMap[user]))
        .map((user: string) => `${usersPath}/${user}`),
);
