import {getConnector, getAllServicesArray, getServicesInfo, getServiceUserGitBranches} from '../api';
import type {Sniffer} from '../helpers';
import {pipe, parapipe, reduceAsync, para2} from '../utils';

export const getGitBranches: Sniffer = parapipe(
    getConnector,
    para2(
        getAllServicesArray,
        getServicesInfo,
        getServiceUserGitBranches,
    ),
    () => ([bashAllServicesArray, bashServicesInfo, bashServiceUserGitBranches]) => pipe(
        bashAllServicesArray,
        reduceAsync((acc, path: string) => pipe(
            bashServicesInfo,
            reduceAsync(async (_acc, {login, folderName}: any) => {
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
            }, acc),
        )(path), {} as any),
    )(),
);
