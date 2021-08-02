import {getOldNodeModulesPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

const task = {
    name: 'OldNodeModules',
    sniffer: getOldNodeModulesPaths
};

pipe([
    info('TASK: Remove Old node_modules From User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
])(task);
