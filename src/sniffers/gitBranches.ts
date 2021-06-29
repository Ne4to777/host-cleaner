import {connector, getAllServicesArray, getServicesInfo, getServiceUserGitBranches} from '../api';
import type {Sniffer} from '../helpers';
import {pipe, reduceAsync} from '../utils';

export const getGitBranches: Sniffer = pipe([
    connector,
    bash => pipe([
        getAllServicesArray(bash),
        reduceAsync((acc, path: string) => pipe([
            getServicesInfo(bash),
            reduceAsync(async (_acc, {login, folderName}: any) => {
                if (login === 'root') return _acc;
                const serviceUserPath = `${path}/${folderName}`;
                const branches = await getServiceUserGitBranches(bash)(serviceUserPath);
                const branchesFiltered = branches.filter(x => x !== 'master');
                if (branchesFiltered.length) {
                    if (!_acc[login]) _acc[login] = {};
                    if (!_acc[login][path]) _acc[login][path] = {};
                    _acc[login][path][folderName] = branchesFiltered;
                }
                return _acc;
            }, acc)
        ])(path), {} as any),
    ])(),
]);
