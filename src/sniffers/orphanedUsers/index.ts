import {connector} from '../../ssh';
import {arrayToExistenceMap, excludeFromMap} from '../../utils';
import {getUsersAllServicesArray, getUsersExistServices, getUsersSymlinksArray} from './helpers';
import {Sniffer} from '../../utils/types';

export const getOrphanedUsersPaths: Sniffer = async ({host}) => {
    const bash = connector({host});
    const usersAllServices = await getUsersAllServicesArray(bash)();
    const usersAllServicesMap = arrayToExistenceMap(usersAllServices);
    const usersSymlinks = await getUsersSymlinksArray(bash)();
    const usersExistServices = await getUsersExistServices(bash)(usersSymlinks);
    const usersServicesOrphanedMap = excludeFromMap({...usersAllServicesMap})(usersExistServices);
    return Object.keys(usersServicesOrphanedMap);
};
