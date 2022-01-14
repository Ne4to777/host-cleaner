import {getDoubledUsersPaths} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {getTask, hostsIterator} from '../helpers';
import {info, para, pipe, processExit0} from '../utils';
import {getEmailContent} from '../helpers/mailLayouts/doubledUsersLayout';

export default pipe(
    info('TASK: Notify Users With Doubled Services'),
    configs => getTask({
        name: 'DoubledUsers',
        sniffer: getDoubledUsersPaths,
        runner: aggregator,
        formatter: getEmailContent,
        configs
    }),
    para(
        mailer,
        hostsIterator
    ),
    ([sendMail, data]) => sendMail(data),
    info('Task is done!'),
    processExit0
);
