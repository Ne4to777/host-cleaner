import {getDismissedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {getTask, hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe(
    info('TASK: Remove Dismissed User Directories'),
    configs => getTask({
        name: 'DismissedUsers',
        sniffer: getDismissedUsersPaths,
        runner: cleaner,
        configs
    }),
    hostsIterator,
    info('Task is done!'),
    processExit0
);
