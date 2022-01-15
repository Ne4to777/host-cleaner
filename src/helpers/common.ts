import {existsSync, mkdirSync, promises as fs} from 'fs';

import {mapAsync, info, pipe, reduce, getUniqueFilename} from '../utils';

import type {HostsIterator, ReportWrite, GetServiceInfoMap, GetTask} from '.';

export const reportWrite: ReportWrite = ({name, folder}) => async content => {
    const folderPath = `./reports/${name}/${folder}`;
    if (!existsSync(folderPath)) mkdirSync(folderPath, {recursive: true});
    return fs.writeFile(`${folderPath}/${getUniqueFilename()}.txt`, content, 'utf8');
};

export const folderizeLastLeaf = reduce((acc: any, path: string) => {
    const splits = path.split('/');
    const login = splits.pop();
    const dir = splits.join('/');
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(login);
    return acc;
}, {});

export const hostsIterator: HostsIterator = ({configs, run}) => pipe(
    mapAsync(pipe(
        host => info(`HOST: ${host}`)(host),
        host => run(host).catch(info(`FAILED ITERATION ON HOST: ${host}`))
    )),
    info('ALL HOSTS ARE ITERATED!')
)(configs.hosts);

export const getServiceInfoMap: GetServiceInfoMap = xs => ({
    login: xs[2],
    folderName: xs[8].replace(/\/$/, '')
});

export const getTask: GetTask = ({runner, sniffer, ...rest}) => ({
    run: runner({sniff: sniffer(rest.configs), ...rest}),
    ...rest
});
