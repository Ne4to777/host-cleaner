import {connector} from '../../ssh';
import {folderizeLastLeaf, getAllServicesArray, getServicesInfo} from '../../helpers';
import type {Sniffer} from '../../helpers';
import {pipe, reduceAsync, reduce, log} from '../../utils';

export const getDoubledUsersPaths: Sniffer = pipe([
    connector,
    bash => pipe([
        getAllServicesArray(bash),
        reduceAsync(async (acc, path: string) => reduce((_acc, serviceInfo: any) => {
            const login = serviceInfo[2];
            if (login === 'root') return acc;
            const folderName = serviceInfo[8].split(' ')[0];
            if (!acc[login]) acc[login] = [];
            acc[login].push(`${path}/${folderName}`);
            return acc;
        }, acc)(await getServicesInfo(bash)(path)), {} as any),
    ])(),
    Object.entries,
    reduce(
        (acc, [login, paths]: any[]) => paths.length <= 1
            ? acc
            : reduce(
                (_acc, [folder, names]: any[]) => {
                    if (names.length <= 1) return _acc;
                    if (!_acc[login]) _acc[login] = {};
                    _acc[login][folder] = names;
                    return _acc;
                }, acc
            )(Object.entries(folderizeLastLeaf(paths))), {} as Record<string, Record<string, string[]>>
    ),
]);
