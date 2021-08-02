import {connector, getOldUserServicesArray, getUserServiceNodeModulesPath} from '../api';
import {mapAsync, pipe, T} from '../utils';
import type {Sniffer} from '../helpers';

export const getOldNodeModulesPaths: Sniffer = pipe([
    connector,
    bash => pipe([
        getOldUserServicesArray,
        T(),
        mapAsync(getUserServiceNodeModulesPath(bash)),
        Object.values,
        xs => xs.filter(Boolean)
    ])(bash)
]);
