import {getConnector, getAllServicesArray, getServicesInfo} from '../api';
import {folderizeLastLeaf} from '../helpers';
import type {Sniffer} from '../helpers';
import {pipe, reduceAsync, reduce, parapipe, para2} from '../utils';

export const getDoubledUsersPaths: Sniffer = parapipe(
    getConnector,
    para2(
        getAllServicesArray,
        getServicesInfo
    ),
    () => ([bashAllServicesArray, bashServicesInfo]) => pipe(
        bashAllServicesArray,
        reduceAsync((acc, path: string) => pipe(
            bashServicesInfo,
            reduce((_acc, {login, folderName}: any) => {
                if (login === 'root') return _acc;
                if (!_acc[login]) _acc[login] = [];
                _acc[login].push(`${path}/${folderName}`);
                return _acc;
            }, acc)
        )(path), {} as any),
        Object.entries,
        reduce(
            (acc, [login, paths]: any[]) => paths.length <= 1
                ? acc
                : pipe(
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
                )(paths), {} as Record<string, Record<string, string[]>>
        ),
    )(),
);
