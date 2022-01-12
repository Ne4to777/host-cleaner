import {getDoubledUsersPaths} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {hostsIterator} from '../helpers';
import {
    info,
    pipe,
    processExit0,
} from '../utils';
import {getMailContent} from '../helpers/mailLayouts/doubledUsersLayout';

export default pipe([
    config => ({
        name: 'DoubledUsers',
        sniffer: getDoubledUsersPaths,
        mailer: getMailContent,
        config
    }),
    info('TASK: Notify Users With Doubled Services'),
    _task => pipe([
        aggregator,
        hostsIterator,
        mailer(_task),
    ])(_task),
    info('Task is done!'),
    processExit0
]);
