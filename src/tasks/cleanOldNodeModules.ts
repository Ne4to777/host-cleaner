import {getOldNodeModulesPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe([
    config => ({
        name: 'OldNodeModules',
        sniffer: getOldNodeModulesPaths,
        config
    }),
    info('TASK: Remove Old node_modules From User Services'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
]);
