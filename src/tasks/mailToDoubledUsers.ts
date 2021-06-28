import {getDoubledUsersPaths} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {hostsIterator} from '../helpers';
import {
    info,
    pipe,
    processExit0,
} from '../utils';

const task = {
    name: 'DoubledUsers',
    sniffer: getDoubledUsersPaths
};

pipe([
    info('TASK: Notify Users With Doubled Services'),
    _task => pipe([
        aggregator,
        hostsIterator,
        mailer(_task),
    ])(_task),
    info('Task is done!'),
    processExit0
])(task);
