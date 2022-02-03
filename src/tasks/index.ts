import {
    getDismissedUsersPaths,
    getDoubledUsersPaths,
    getGitBranches,
    getNodeModulesPaths,
    getOldNodeModulesPaths,
    getOldUserServices,
    getOrphanedUsersPaths,
    getUsersCacachePaths,
    getUsersVSCodePaths,
} from '../sniffers';
import {cleaner, mailer} from '../runners';
import {getEmailContent} from '../helpers/mailLayouts/gitBranchesLayout';

export default {
    cleanDismissedUsers: {
        name: 'cleanDismissedUsers',
        description: 'Remove Dismissed User Directories',
        sniffer: getDismissedUsersPaths,
        runners: {
            each: cleaner,
        },
    },
    cleanNodeModules: {
        name: 'cleanNodeModules',
        description: 'Remove node_modules From User Services',
        sniffer: getNodeModulesPaths,
        runners: {
            each: cleaner,
        },
    },
    cleanOldNodeModules: {
        name: 'cleanOldNodeModules',
        description: 'Remove Old node_modules From User Services',
        sniffer: getOldNodeModulesPaths,
        runners: {
            each: cleaner,
        },
    },
    cleanOldServices: {
        name: 'cleanOldServices',
        description: 'Remove Old User Services',
        sniffer: getOldUserServices,
        runners: {
            each: cleaner,
        },
    },
    cleanOrphanedUsers: {
        name: 'cleanOrphanedUsers',
        description: 'Remove Orphaned User Services',
        sniffer: getOrphanedUsersPaths,
        runners: {
            each: cleaner,
        },
    },
    cleanUsersCacache: {
        name: 'cleanUsersCacache',
        description: 'Clean Users .npm/_cacache',
        sniffer: getUsersCacachePaths,
        runners: {
            each: cleaner,
        },
    },
    cleanUsersVSCode: {
        name: 'cleanUsersVSCode',
        description: 'Clean Users .vscode*',
        sniffer: getUsersVSCodePaths,
        runners: {
            each: cleaner,
        },
    },
    mailGitBranches: {
        name: 'mailGitBranches',
        description: 'Notify Users About Unused Git Branches',
        sniffer: getGitBranches,
        runners: {
            total: mailer,
        },
        formatter: getEmailContent,
    },
    mailDoubledUsers: {
        name: 'mailDoubledUsers',
        description: 'Notify Users With Doubled Services',
        sniffer: getDoubledUsersPaths,
        runners: {
            total: mailer,
        },
        formatter: getEmailContent,
    },
};
