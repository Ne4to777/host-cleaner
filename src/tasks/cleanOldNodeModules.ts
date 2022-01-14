import {getOldNodeModulesPaths} from '../sniffers';
import {cleaner} from '../runners';
import {getTask, hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe(
    info('TASK: Remove Old node_modules From User Services'),
    configs => getTask({
        name: 'OldNodeModules',
        sniffer: getOldNodeModulesPaths,
        runner: cleaner,
        configs
    }),
    hostsIterator,
    info('Task is done!'),
    processExit0
);
