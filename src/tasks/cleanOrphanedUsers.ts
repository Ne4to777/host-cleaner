import {getOrphanedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {pipe, info, processExit0} from '../utils';

const task = {
    name: 'OrphanedUsers',
    sniffer: getOrphanedUsersPaths
};

pipe([
    info('TASK: Remove Orphaned User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
])(task);
