import {getOrphanedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {getTask, hostsIterator} from '../helpers';
import {pipe, info, processExit0} from '../utils';

export default pipe(
    info('TASK: Remove Orphaned User Services'),
    configs => getTask({
        name: 'OrphanedUsers',
        sniffer: getOrphanedUsersPaths,
        runner: cleaner,
        configs
    }),
    hostsIterator,
    info('Task is done!'),
    processExit0
);
