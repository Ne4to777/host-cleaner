#!/usr/bin/env node
import {rmdirSync} from 'fs';

import yargs from 'yargs';

import defaultConfigs from '../configs';
import tasks from '../tasks';
import {addCommands} from '../helpers';

try {
    rmdirSync(`${process.cwd()}/debug`, {recursive: true});
} catch (err) {
    // empty
}

(() => addCommands(tasks)(yargs(process.argv.slice(2))
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
    .option('days-expired', {
        type: 'number',
        default: defaultConfigs.daysExpired,
        alias: 'd',
        describe: 'expiration date parameter for corresponding sniffers',
    })
    .option('email-from', {
        type: 'string',
        default: defaultConfigs.email.from,
        alias: 'f',
        describe: 'email sender',
    })
    .option('email-subject', {
        type: 'string',
        default: defaultConfigs.email.subject,
        alias: 'j',
        describe: 'email subject',
    })
    .help(),
).argv)();
