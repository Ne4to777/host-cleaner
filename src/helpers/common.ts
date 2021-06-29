import {existsSync, promises as fs} from 'fs';

import {mapAsync, info, pipe, reduce} from '../utils';
import configs from '../configs';

import type {
    HostsIterator,
    RunnerWithParams,
    ReportWrite,
    GetServiceInfoMap
} from '.';

const {hosts} = configs;

export type GetReportName = () => string
export const getReportName: GetReportName = () => {
    const date = new Date();
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}__${
        date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
};

export const reportWrite: ReportWrite = ({task, folder}) => async content => {
    const reportsPath = './reports';
    const taskPath = `${reportsPath}/${task.name}`;
    const folderPath = `${taskPath}/${folder}`;
    if (!existsSync(reportsPath)) await fs.mkdir(reportsPath);
    if (!existsSync(taskPath)) await fs.mkdir(taskPath);
    if (!existsSync(folderPath)) await fs.mkdir(folderPath);
    return fs.writeFile(`${folderPath}/${getReportName()}.txt`, content, 'utf8');
};

export const folderizeLastLeaf = reduce((acc: any, path: string) => {
    const splits = path.split('/');
    const login = splits.pop();
    const dir = splits.join('/');
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(login);
    return acc;
}, {});

export const hostsIterator: HostsIterator = (runner: RunnerWithParams) =>
    mapAsync((host:string) => pipe([
        info(`HOST: ${host}`),
        runner
    ])(host)
        .catch(info(`FAILED ITERATION ON HOST: ${host}`))
    )(hosts)
        .then(info('ALL HOSTS ARE ITERATED!'));

export const getServiceInfoMap: GetServiceInfoMap = xs => ({
    login: xs[2],
    folderName: xs[8].replace(/\/$/, '')
});
