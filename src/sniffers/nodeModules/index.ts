import {connector, getAllServiceNodeModules} from '../../api';
import {pipe, T} from '../../utils';
import type {Sniffer} from '../../helpers';

export const getNodeModulesPaths: Sniffer = pipe([
    connector,
    getAllServiceNodeModules,
    T(),
]);
