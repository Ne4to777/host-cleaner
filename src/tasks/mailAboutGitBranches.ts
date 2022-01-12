import {getGitBranches} from '../sniffers';
import {aggregator, mailer} from '../runners';
import {hostsIterator} from '../helpers';
import {
    info,
    pipe,
    processExit0,
} from '../utils';
import {getEmailContent} from '../helpers/mailLayouts/gitBranchesLayout';

export default pipe([
    config => ({
        name: 'GitBranches',
        sniffer: getGitBranches,
        mailer: getEmailContent,
        config
    }),
    info('TASK: Notify Users About Unused Git Branches'),
    _task => pipe([
        aggregator,
        hostsIterator,
        mailer(_task),
    ])(_task),
    info('Task is done!'),
    processExit0
]);
