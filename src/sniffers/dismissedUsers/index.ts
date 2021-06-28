import {arrayToExistenceMap, pipe} from '../../utils';
import {getAllDismissedUsersCached, getUsersAllArray, connector} from '../../api';
import type {Sniffer} from '../../helpers';
import configs from '../../configs';

const {usersPath} = configs;

export const getDismissedUsersPaths: Sniffer = pipe([
    connector,
    getUsersAllArray,
    bashUsersAllArray => Promise.all([bashUsersAllArray(), getAllDismissedUsersCached()]),
    ([usersAll, usersDismissed]) => usersAll
        .filter((user: string) => Boolean(arrayToExistenceMap(usersDismissed)[user]))
        .map((user: string) => `${usersPath}/${user}`)
]);
