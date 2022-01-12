import {getOldServices} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe([
    config => ({
        name: 'OldServices',
        sniffer: getOldServices,
        config
    }),
    info('TASK: Remove Old User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
]);
