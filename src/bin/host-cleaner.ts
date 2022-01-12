#!/usr/bin/env node
import yargs from 'yargs';

import {mergeConfigs, pipe} from '../utils';
import defaultConfigs from '../configs';
import cleanDismissedUsers from '../tasks/cleanDismissedUsers';
import cleanOrphanedUsers from '../tasks/cleanOrphanedUsers';
import cleanNodeModules from '../tasks/cleanNodeModules';
import cleanOldNodeModules from '../tasks/cleanOldNodeModules';
import cleanOldUserServices from '../tasks/cleanOldUserServices';
import mailAboutGitBranches from '../tasks/mailAboutGitBranches';
import mailToDoubledUsers from '../tasks/mailToDoubledUsers';

const withConfigs = (f: (x: any) => any) => pipe([mergeConfigs, f]);

export default yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .option('mode', {
        type: 'string',
        default: defaultConfigs.mode,
        alias: 'm',
        describe: 'execution mode',
    })
    .command('cleanDismissedUsers', 'Clean Dismissed Users Task', () => null, withConfigs(cleanDismissedUsers))
    .command('cleanOrphanedUsers', 'Clean Orphaned Users Task', () => null, withConfigs(cleanOrphanedUsers))
    .command('cleanNodeModules', 'Clean Node Modules Task', () => null, withConfigs(cleanNodeModules))
    .command('cleanOldNodeModules', 'Clean Old Node Modules Task', () => null, withConfigs(cleanOldNodeModules))
    .command('cleanOldUserServices', 'Clean Old User Services Task', () => null, withConfigs(cleanOldUserServices))
    .command('mailAboutGitBranches', 'Mail About Git Branches Task', () => null, withConfigs(mailAboutGitBranches))
    .command('mailToDoubledUsers', 'Mail To Doubled Users Task', () => null, withConfigs(mailToDoubledUsers))
    .help()
    .argv;
