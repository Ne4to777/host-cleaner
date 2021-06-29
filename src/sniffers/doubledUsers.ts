import {connector, getAllServicesArray, getServicesInfo} from '../api';
import {folderizeLastLeaf} from '../helpers';
import type {Sniffer} from '../helpers';
import {pipe, reduceAsync, reduce, pipeSync} from '../utils';

export const getDoubledUsersPaths: Sniffer = pipe([
    connector,
    bash => pipe([
        getAllServicesArray(bash),
        reduceAsync((acc, path: string) => pipe([
            getServicesInfo(bash),
            reduce((_acc, {login, folderName}: any) => {
                if (login === 'root') return _acc;
                if (!_acc[login]) _acc[login] = [];
                _acc[login].push(`${path}/${folderName}`);
                return _acc;
            }, acc)
        ])(path), {} as any),
    ])(),
    Object.entries,
    reduce(
        (acc, [login, paths]: any[]) => paths.length <= 1
            ? acc
            : pipeSync([
                folderizeLastLeaf,
                Object.entries,
                reduce(
                    (_acc, [folder, names]: any[]) => {
                        if (names.length <= 1) return _acc;
                        if (!_acc[login]) _acc[login] = {};
                        _acc[login][folder] = names;
                        return _acc;
                    }, acc
                )
            ])(paths), {} as Record<string, Record<string, string[]>>
    ),
]);
