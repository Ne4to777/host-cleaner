import {getConnector, getAllServiceNodeModulesArray} from '../api';
import {parapipe, T} from '../utils';
import type {Sniffer} from '../helpers';

export const getNodeModulesPaths: Sniffer = parapipe(
    getConnector,
    getAllServiceNodeModulesArray,
    T,
);
