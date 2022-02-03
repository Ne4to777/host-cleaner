import type {Sniffer} from '../helpers';
import {
    arrayToExistenceMap,
    excludeFromMap,
    K2,
    log,
    mapifyAsync,
    para,
    para2,
    parapipe,
    pipe,
    reduce,
    reduce2Async,
    reduceAsync,
    T,
    toPipe,
    uncurry,
} from '../utils';
import {
    getAllDismissedUsersCached,
    getAllServiceNodeModulesArray,
    getAllServicesArray,
    getConnector,
    getHasUserServicesArrayNewerThen,
    getServicesInfo,
    getServiceUserGitBranches,
    getUsersAllArray,
    getUsersAllServicesArray,
    getUsersCacacheArray,
    getUserServiceNodeModulesPath,
    getUsersExistServices,
    getUsersSymlinksArray,
    getUsersVSCodeArray,
} from '../api';

export const getDismissedUsersPaths: Sniffer = parapipe(
    getConnector,
    getUsersAllArray,
    toPipe(
        bashUsersAllArray => para(
            bashUsersAllArray,
            pipe(getAllDismissedUsersCached, arrayToExistenceMap),
        )(),
    ),
    ({usersPath}) => ([usersAll, usersDismissedMap]) => usersAll
        .filter((user: string) => Boolean(usersDismissedMap[user]))
        .map((user: string) => `${usersPath}/${user}`),
);

export const getDoubledUsersPaths: Sniffer = parapipe(
    getConnector,
    para2(
        getServicesInfo,
        K2((acc: any) => (path: string) => ({login, folderName}: any) => login === 'root'
            ? acc
            : {...acc, [login]: {...acc[login], [path]: [...((acc[login] || {})[path] || []), folderName]}},
        ),
        parapipe(getAllServicesArray, T),
    ),
    toPipe(
        uncurry(reduce2Async(() => ({}))),
        Object.entries,
        reduce(() => ({}))(acc => ([login, paths]) => pipe(
            Object.entries,
            reduce(() => acc)(_acc => ([folder, names]) => names.length <= 1
                ? _acc
                : {..._acc, [login]: {..._acc[login], [folder]: names}},
            ),
        )(paths)),
    ),
);

export const getGitBranches: Sniffer = parapipe(
    getConnector,
    para2(
        parapipe(getAllServicesArray, T),
        getServicesInfo,
        getServiceUserGitBranches,
    ),
    toPipe(
        ([allServicesArray, bashServicesInfo, bashServiceUserGitBranches]) =>
            reduceAsync(() => ({}))(
                acc => path => pipe(
                    bashServicesInfo,
                    reduceAsync(() => acc)(_acc => async ({login, folderName}: any) => {
                        if (login === 'root') return _acc;
                        const serviceUserPath = `${path}/${folderName}`;
                        const branches = await bashServiceUserGitBranches(serviceUserPath);
                        const branchesFiltered = branches.filter((x: string) => x !== 'master');
                        if (branchesFiltered.length) {
                            if (!_acc[login]) _acc[login] = {};
                            if (!_acc[login][path]) _acc[login][path] = {};
                            _acc[login][path][folderName] = branchesFiltered;
                        }
                        return _acc;
                    }),
                )(path),
            )(allServicesArray),
    ),
);

export const getNodeModulesPaths: Sniffer = parapipe(
    getConnector,
    getAllServiceNodeModulesArray,
    T,
);

export const getOldUserServices: Sniffer = parapipe(
    getConnector,
    para2(
        getHasUserServicesArrayNewerThen,
        getUsersAllServicesArray,
    ),
    toPipe(
        ([bashUserServicesArrayNewerThen, bashUsersAllServicesArray]) => pipe(
            bashUsersAllServicesArray,
            para(
                arrayToExistenceMap,
                reduceAsync(() => [])(acc => async path => {
                    log(path);
                    return acc.concat(await bashUserServicesArrayNewerThen(path) ? path : []);
                }),
            ),
        )(),
        uncurry(excludeFromMap),
        Object.keys,
    ),
);

export const getOldNodeModulesPaths: Sniffer = parapipe(
    para2(
        parapipe(getConnector, getUserServiceNodeModulesPath),
        getOldUserServices,
    ),
    () => ([bashUserServiceNodeModulesPath, oldServices]) => pipe(
        mapifyAsync(bashUserServiceNodeModulesPath),
        Object.values,
        reduce(() => [])(acc => x => acc.concat(x || [])),
    )(oldServices),
);

export const getOrphanedUsersPaths: Sniffer = parapipe(
    getConnector,
    para2(getUsersExistServices, getUsersAllServicesArray, getUsersSymlinksArray),
    toPipe(
        ([bashUsersExistServices, bashUsersAllServicesArray, bashUsersSymlinksArray]) =>
            para(
                pipe(
                    bashUsersAllServicesArray,
                    arrayToExistenceMap,
                ),
                pipe(
                    bashUsersSymlinksArray,
                    bashUsersExistServices,
                ),
            )(),
        uncurry(excludeFromMap),
        Object.keys,
    ),
);

export const getUsersCacachePaths: Sniffer = parapipe(
    getConnector,
    getUsersCacacheArray,
    toPipe(T()),
);

export const getUsersVSCodePaths: Sniffer = parapipe(
    getConnector,
    getUsersVSCodeArray,
    toPipe(T()),
);
