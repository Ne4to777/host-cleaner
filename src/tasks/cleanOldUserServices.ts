import {getOldServices} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

const task = {
    name: 'OldServices',
    sniffer: getOldServices
};

pipe([
    info('TASK: Remove Old User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
])(task);
