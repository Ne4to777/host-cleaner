import {getOldServices} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe(
    info('TASK: Remove Old User Services'),
    configs => ({
        name: 'OldServices',
        sniffer: getOldServices,
        configs
    }),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
);
