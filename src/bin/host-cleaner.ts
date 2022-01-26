#!/usr/bin/env node
import {rmdirSync} from 'fs';

import yargs from 'yargs';

import {mergeConfigs, NULL, pipe} from '../utils';
import defaultConfigs from '../configs';
import {
    cleanDismissedUsers,
    cleanOrphanedUsers,
    cleanNodeModules,
    cleanOldNodeModules,
    cleanOldUserServices,
    mailAboutGitBranches,
    mailToDoubledUsers,
} from '../tasks';

const withConfigs = (f: (x: any) => any) => pipe(mergeConfigs, f);

try {
    rmdirSync(`${process.cwd()}/debug`, {recursive: true});
} catch (err) {
    // empty
}

(() => yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .option('mode', {
        type: 'string',
        default: defaultConfigs.mode,
        alias: 'm',
        describe: 'execution mode',
    })
    .option('ssh', {
        type: 'boolean',
        default: defaultConfigs.ssh,
        alias: 's',
        describe: 'need ssh',
    })
    .option('debug-commands', {
        type: 'boolean',
        default: defaultConfigs.debugCommands,
        alias: 'c',
        describe: 'debug commands to file',
    })
    .option('hosts', {
        type: 'array',
        default: defaultConfigs.hosts,
        alias: 'h',
        describe: 'hosts to clean',
    })
    .command('cleanDismissedUsers', 'Clean Dismissed Users Task', NULL, withConfigs(cleanDismissedUsers))
    .command('cleanOrphanedUsers', 'Clean Orphaned Users Task', NULL, withConfigs(cleanOrphanedUsers))
    .command('cleanNodeModules', 'Clean Node Modules Task', NULL, withConfigs(cleanNodeModules))
    .command('cleanOldNodeModules', 'Clean Old Node Modules Task', NULL, withConfigs(cleanOldNodeModules))
    .command('cleanOldUserServices', 'Clean Old User Services Task', NULL, withConfigs(cleanOldUserServices))
    .command('mailAboutGitBranches', 'Mail About Git Branches Task', NULL, withConfigs(mailAboutGitBranches))
    .command('mailToDoubledUsers', 'Mail To Doubled Users Task', NULL, withConfigs(mailToDoubledUsers))
    .help()
    .argv
)();
