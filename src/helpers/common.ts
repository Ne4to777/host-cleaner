import {existsSync, promises as fs} from 'fs';

import {getSymlinkAbsPath} from '../ssh';
import {mapAsync, info, reduceAsync, replaceBy, splitByLines, pipe, reduce} from '../utils';
import configs from '../configs';

import type {
    GetDoublesByLoginsMap,
    GetUsersExistServices,
    TrimLoginSuffix,
    HostsIterator,
    RunnerWithParams,
    VoidToArrayAsync,
    ReportWrite,
    GetServicesInfo
} from '.';

const {servicesPath, usersPath, hosts} = configs;

export const getUsersSymlinksArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 2 -maxdepth 2 -regex ".+_.+" -type l',
    usersPath
)
    .then(splitByLines);

export const getUsersAllServicesArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 2 -maxdepth 2 -type d',
    servicesPath
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServicesArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    servicesPath
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServiceNodeModules: VoidToArrayAsync = bash => () => bash(
    'find . -name node_modules -type d -maxdepth 3',
    servicesPath
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getUsersExistServices: GetUsersExistServices = bash => reduceAsync(
    async (acc: string[], link: string) => {
        const symlinkAbsPath = await getSymlinkAbsPath(bash)(link, usersPath);
        if (symlinkAbsPath) return acc.concat(symlinkAbsPath);
        return acc;
    }, []
);

export const getUsersAllArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    usersPath
)
    .then(splitByLines);

export const getServicesInfo: GetServicesInfo = bash => path => bash(
    'ls -l',
    path
)
// @ts-ignore
    .then((servicesinfo: string) => servicesinfo
        .split('\n')
        .slice(1)
        .map((row:string) => row.replace(/\s+/g, ' ').split(' ')));

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

export const trimLoginSuffix: TrimLoginSuffix = x => x.replace(/\d+$/, '');

export const getDoublesByLoginsMap: GetDoublesByLoginsMap = refIndex => xs => xs
    .slice(0, -1)
    .reduce((doubles: Record<string, string[]>, value: any, i: number) => {
        const iNext = i + 1;
        const ref = xs[refIndex];
        const control = xs[iNext];
        if (trimLoginSuffix(ref) === trimLoginSuffix(control)) {
            if (!doubles[ref]) doubles[ref] = [ref];
            // @ts-ignore
            doubles[ref] = doubles[ref].concat(control);
        } else {
            // eslint-disable-next-line no-param-reassign
            refIndex = iNext;
        }
        return doubles;
    }, {});

export const hostsIterator: HostsIterator = (runner: RunnerWithParams) =>
    mapAsync((host:string) => pipe([
        info(`HOST: ${host}`),
        runner
    ])(host)
        .catch(info(`FAILED ITERATION ON HOST: ${host}`))
    )(hosts)
        .then(info('ALL HOSTS ARE ITERATED!'));
