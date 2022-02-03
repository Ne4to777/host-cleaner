import {existsSync, mkdirSync, promises as fs} from 'fs';

import yargs from 'yargs';

import {
    mapifyAsync,
    info,
    pipe,
    getUniqueFilename,
    parapipe,
    toPipe,
    para,
    I,
    processExit0,
    mergeFlat,
    NULL,
} from '../utils';
import defaultConfigs from '../configs';

import type {HostsIterator, ReportWrite, GetServiceInfoMap, GetTask, TaskMeta} from '.';

export const reportWrite: ReportWrite = ({name, folder}) => async content => {
    const folderPath = `./reports/${name}/${folder}`;
    if (!existsSync(folderPath)) mkdirSync(folderPath, {recursive: true});
    return fs.writeFile(`${folderPath}/${getUniqueFilename()}.txt`, content, 'utf8');
};

export const hostsIterator: HostsIterator = ({configs, runEach, sniff}) => pipe(
    info(`ITERATION THROUGH HOSTS:\n${configs.hosts.join('\n')}\n`),
    mapifyAsync(pipe(
        info((host: string) => `\nHOST: ${host}`),
        host => sniff(host)
            .then((data: any) => runEach ? runEach(host)(data) : data)
            .catch(info(`FAILED ITERATION ON HOST: ${host}`)),
    )),
    info('ALL HOSTS ARE ITERATED!\n'),
)(configs.hosts);

export const getServiceInfoMap: GetServiceInfoMap = xs => ({
    login: xs[2],
    folderName: xs[8].replace(/\/$/, ''),
});

export const getTask: GetTask = ({runners, sniffer, ...rest}) => configs => ({
    runEach: runners.each ? runners.each({configs, ...rest}) : null,
    runTotal: runners.total ? runners.total({configs, ...rest}) : null,
    sniff: sniffer(configs),
    configs,
    ...rest,
});

export const processTask = parapipe(
    meta => configs => getTask(meta)(mergeFlat(defaultConfigs)(configs)),
    toPipe(
        info((task: any) => `TASK: ${task.description}\n`),
        para(
            task => task.runTotal || I,
            hostsIterator,
        ),
        ([runTotal, data]) => runTotal(data),
        info('Task is done!'),
        processExit0,
    ),
);

type AddCommands<Y> = (tasks: Record<string, TaskMeta>) => (yarg: Y) => Y
export const addCommands: AddCommands<typeof yargs> = tasks => yarg => Object
    .values(tasks)
    .reduce((acc, meta) => acc.command(meta.name, meta.description, NULL, processTask(meta)), yarg);
