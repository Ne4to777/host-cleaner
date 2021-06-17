import {Runner} from '../helpers';
import {info, pipe} from '../utils';

export const aggregator: Runner = ({sniffer}) => pipe([
    info('Gathering info...'),
    host => ({host}),
    sniffer,
]);
