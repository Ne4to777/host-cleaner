import {
    getDismissedUsersPaths,
    getDoubledUsersPaths,
    getGitBranches,
    getOldNodeModulesPaths,
    getOldUserServices,
    getOrphanedUsersPaths,
} from '../sniffers';
import {cleaner, mailer} from '../runners';
import {getGitBranchesEmailContent, getDoubledUsersEmailContent} from '../helpers';
import cfg from '../configs';

export default [
    {
        name: 'cleanDismissedUsers',
        description: 'Remove Dismissed User Directories',
        sniffer: getDismissedUsersPaths,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanNodeModules',
        description: 'Remove node_modules From User Services',
        sniffer: `find ${cfg.servicesPath} -maxdepth 3 -name node_modules -type d`,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanOldNodeModules',
        description: 'Remove Old node_modules From User Services',
        sniffer: getOldNodeModulesPaths,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanOldServices',
        description: 'Remove Old User Services',
        sniffer: getOldUserServices,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanOrphanedUsers',
        description: 'Remove Orphaned User Services',
        sniffer: getOrphanedUsersPaths,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanUsersCacache',
        description: 'Clean Users .npm/_cacache',
        sniffer: `find ${cfg.usersPath}/*/.npm/_cacache -maxdepth 0`,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'cleanUsersVSCode',
        description: 'Clean Users .vscode*',
        sniffer: `find ${cfg.usersPath}/*/.vscode* -maxdepth 0`,
        runners: {
            each: cleaner,
        },
    },
    {
        name: 'mailAboutGitBranches',
        description: 'Notify Users About Unused Git Branches',
        sniffer: getGitBranches,
        runners: {
            total: mailer,
        },
        formatter: getGitBranchesEmailContent,
    },
    {
        name: 'mailToDoubledUsers',
        description: 'Notify Users With Doubled Services',
        sniffer: getDoubledUsersPaths,
        runners: {
            total: mailer,
        },
        formatter: getDoubledUsersEmailContent,
    },
];
