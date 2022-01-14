import type {Sniffer} from '../helpers';
import {getConnector, getUserServiceNodeModulesPath} from '../api';
import {mapAsync, pipe, parapipe, reduce, para2} from '../utils';
import {getOldServices} from './oldUserServices';

export const getOldNodeModulesPaths: Sniffer = parapipe(
    para2(
        parapipe(getConnector, getUserServiceNodeModulesPath),
        getOldServices
    ),
    () => ([bashUserServiceNodeModulesPath, oldServices]) => pipe(
        mapAsync(bashUserServiceNodeModulesPath),
        Object.values,
        reduce((acc, x: any) => acc.concat(x), [])
    )(oldServices)
);
