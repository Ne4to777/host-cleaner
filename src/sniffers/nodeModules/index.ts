import {connector} from '../../ssh';
import {pipe, T} from '../../utils';
import {getAllServiceNodeModules} from '../../helpers';
import type {Sniffer} from '../../helpers';

export const getNodeModulesPaths: Sniffer = pipe([
    connector,
    getAllServiceNodeModules,
    T(),
]);
