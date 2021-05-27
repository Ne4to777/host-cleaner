import {connector} from '../../ssh';
import {arrayToExistenceMap} from '../../utils';
import {getAllDismissedUsersCached} from '../../api';
import configs from '../../configs';
import type {Sniffer} from '../../utils/types';
import {getUsersAllArray} from './helpers';

const {usersPath} = configs;

export const getDismissedUsersPaths: Sniffer = async ({host}) => {
    const bash = connector({host});
    const [usersAll, usersDismissed] = await Promise.all([
        getUsersAllArray(bash)(),
        getAllDismissedUsersCached()
    ]);
    const usersDismissedMap = arrayToExistenceMap(usersDismissed);
    return usersAll
        .filter(user => Boolean(usersDismissedMap[user]))
        .map(user => `${usersPath}/${user}`);
};
