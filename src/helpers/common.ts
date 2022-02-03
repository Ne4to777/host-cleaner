import {existsSync, mkdirSync, promises as fs} from 'fs';
import {promisify} from 'util';
import {exec} from 'child_process';

import yargs from 'yargs';
import {NodeSSH} from 'node-ssh';
import * as dotenv from 'dotenv';

import {
    mapifyAsync,
    info,
    pipe,
    getUniqueFilename,
    parapipe,
    toPipe,
    processExit0,
    NULL,
    debugCommandsToFile,
    I,
    splitByLines,
    copySimpleObject,
} from '../utils';
import defaultConfigs from '../configs';

import type {HostsIterator, ReportWrite, GetServiceInfoMap, GetTask, TaskMeta} from '.';

dotenv.config({path: './.env'});

const run = promisify(exec);

const {USERNAME, PRIVATE_KEY_PATH, PASSPHRASE} = process.env;

const ssh = new NodeSSH();

type Connector = (configs: any) => (host: string) => (command:string, folder:string) => Promise<string>

export const connectorSSH: Connector = ({debugCommands}) => host => {
    if (!host) throw new Error('SSH host is missed');
    const session = ssh.connect({
        host,
        username: USERNAME,
        privateKey: PRIVATE_KEY_PATH,
        passphrase: PASSPHRASE,
        readyTimeout: 60000,
    });
    return (command, folder = '/') => session
        .then(() => debugCommands && debugCommandsToFile(command, folder, host))
        .then(() => ssh.execCommand(command, {cwd: folder}))
        .then(({stdout}) => stdout);
};

export const connectorNode: Connector = ({debugCommands}) => host => (command, folder = '/') => {
    if (debugCommands) debugCommandsToFile(command, folder, host);
    return run(command, {cwd: folder, maxBuffer: 10240000}).then(({stdout}) => stdout);
};

export const getConnector: Connector = configs => configs.ssh ? connectorSSH(configs) : connectorNode(configs);

export const reportWrite: ReportWrite = ({name, folder}) => async content => {
    const folderPath = `./reports/${name}/${folder}`;
    if (!existsSync(folderPath)) mkdirSync(folderPath, {recursive: true});
    return fs.writeFile(`${folderPath}/${getUniqueFilename()}.txt`, content, 'utf8');
};

export const hostsIterator: HostsIterator = ({configs, runEach, runTotal, sniff}) => pipe(
    info(`ITERATION THROUGH HOSTS:\n${configs.hosts.join('\n')}\n`),
    mapifyAsync(pipe(
        info((host: string) => `\nHOST: ${host}`),
        info('Gathering paths...'),
        host => sniff(host)
            .then(runEach(host))
            .catch(info((err: any) => `FAILED ITERATION ON HOST: ${host}\n${err}`)),
    )),
    info('ALL HOSTS ARE ITERATED!\n'),
    runTotal,
)(configs.hosts);

export const getServiceInfoMap: GetServiceInfoMap = xs => ({
    login: xs[2],
    folderName: xs[8].replace(/\/$/, ''),
});

export const getTask: GetTask = ({
    runners: {each = () => I, total = () => I},
    sniffer,
    ...rest
}) => configs => ({
    runEach: each({configs, ...rest}),
    runTotal: total({configs, ...rest}),
    sniff: typeof sniffer === 'string'
        ? (host: string) => getConnector(configs)(host)(sniffer, '/').then(splitByLines)
        : sniffer(configs),
    configs,
    ...rest,
});

type MergeConfigs = (o1: Record<string, any>) => (o2: Record<string, any>) => Record<string, any>
const mergeConfigs: MergeConfigs = defaults => configs => Object
    .entries(configs)
    .reduce((acc, [key, el]) => {
        if (/^email-/.test(key)) {
            const [, prop] = key.split('-');
            acc.email[prop] = el;
        }
        acc[key] = el;
        return acc;
    }, copySimpleObject(defaults));

export const processTask = parapipe(
    meta => configs => getTask(meta)(mergeConfigs(defaultConfigs)(configs)),
    toPipe(
        info((task: any) => `TASK: ${task.description}\n`),
        hostsIterator,
        info('Task is done!'),
        processExit0,
    ),
);

type AddCommands<Y> = (tasks: TaskMeta[]) => (yarg: Y) => Y
export const addCommands: AddCommands<typeof yargs> = tasks => yarg => tasks
    .reduce((acc, meta) => acc
        .command(meta.name, meta.description, NULL, processTask(meta)), yarg);
