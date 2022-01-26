import {getGitBranches} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {getTask, hostsIterator} from '../helpers';
import {info, para, pipe, processExit0} from '../utils';
import {getEmailContent} from '../helpers/mailLayouts/gitBranchesLayout';

export default pipe(
    info('TASK: Notify Users About Unused Git Branches'),
    configs => getTask({
        name: 'GitBranches',
        sniffer: getGitBranches,
        runner: aggregator,
        formatter: getEmailContent,
        configs,
    }),
    para(
        mailer,
        hostsIterator,
    ),
    ([sendMail, data]) => sendMail(data),
    info('Task is done!'),
    processExit0,
);
