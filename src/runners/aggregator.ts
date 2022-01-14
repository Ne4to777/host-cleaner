import type {HostRunner} from '../helpers';
import {info, pipe} from '../utils';

export const aggregator: HostRunner = ({sniff}) => pipe(
    info('Gathering info...'),
    sniff,
);
