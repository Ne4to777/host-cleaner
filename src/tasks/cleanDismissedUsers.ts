import {getDismissedUsersPaths} from '../sniffers';
import {cleaner} from '../runners';
import {hostsIterator} from '../helpers';
import {info, pipe, processExit0} from '../utils';

export default pipe([
    config => ({
        name: 'DismissedUsers',
        sniffer: getDismissedUsersPaths,
        config
    }),
    info('TASK: Remove Dismissed User Directories'),
    cleaner,
    hostsIterator,
    info('Task is done!'),
    processExit0
]);
