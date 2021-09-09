import {connector, getUserServiceNodeModulesPath} from '../api';
import {mapAsync, pipe, parallel, T, reduce} from '../utils';
import type {Sniffer} from '../helpers';
import {getOldServices} from './oldUserServices';

export const getOldNodeModulesPaths: Sniffer = pipe([
    parallel([
        pipe([connector, getUserServiceNodeModulesPath, mapAsync]),
        getOldServices,
    ]),
    T((mapServices: any) => pipe([
        mapServices,
        Object.values,
        reduce((acc, x: any) => acc.concat(x), [])
    ]))
]);
