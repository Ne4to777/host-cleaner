import {getOrphanedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {pipe, info, processExit0} from '../utils';

export default pipe([
    config => ({
        name: 'OrphanedUsers',
        sniffer: getOrphanedUsersPaths,
        config
    }),
    info('TASK: Remove Orphaned User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
]);
