import {getNodeModulesPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

const task = {
    name: 'NodeModules',
    sniffer: getNodeModulesPaths
};

pipe([
    info('TASK: Remove node_modules From User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
])(task);
