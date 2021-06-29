import {getGitBranches} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {hostsIterator} from '../helpers';
import {
    info,
    pipe,
    processExit0,
} from '../utils';
import {getEmailContent} from '../helpers/mailLayouts/gitBranchesLayout';

const task = {
    name: 'GitBranches',
    sniffer: getGitBranches,
    mailer: getEmailContent
};

pipe([
    info('TASK: Notify Users About Unused Git Branches'),
    _task => pipe([
        aggregator,
        hostsIterator,
        mailer(_task),
    ])(_task),
    info('Task is done!'),
    processExit0
])(task);
