import {getDismissedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

const task = {
    name: 'DismissedUsers',
    sniffer: getDismissedUsersPaths
};

pipe([
    info('TASK: Remove Dismissed User Directories'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
])(task);
