import type {HostRunner} from '../helpers';
import {info, pipe} from '../utils';

export const aggregator: HostRunner = ({sniffer}) => pipe([
    info('Gathering info...'),
    host => ({host}),
    sniffer,
]);
