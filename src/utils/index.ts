import {promises as fs, existsSync} from 'fs';

import {config} from 'dotenv';

import {connector, getDiskUsage, removeRecByPath} from '../ssh';
import {Sniffer} from './types';

type InitEnv = () => any
export const initEnv: InitEnv = () => config({path: './.env'});

type GetQuery = (params:{
    query: string,
    conditions: string[],
    fields: string[],
    limit: number,
}) => string

export const getQuery:GetQuery = ({
    query = '',
    conditions = [],
    fields = [],
    limit = 0
}) => {
    const result = [];
    if (query) result.push(`_query=${encodeURIComponent(query)}`);
    if (conditions.length) result.push(conditions.join(','));
    if (fields.length) result.push(`_fields=${fields.join(',')}`);
    if (limit) result.push(`_limit=${limit}`);
    return result.join('&');
};

export type ReduceAsync = <Acc, X>(f:(acc:Acc, x:X) => Promise<Acc>, acc:Acc) => (xs: X[]) => Promise<Acc>
export const reduceAsync: ReduceAsync = (f, acc) => async xs => {
    for (const x of xs) {
        // eslint-disable-next-line no-param-reassign,no-await-in-loop
        acc = await f(acc, x);
    }
    return acc;
};

export type ForEachAsync = <X>(f:(x:X) => Promise<void>) => (xs: X[]) => Promise<void>
export const forEachAsync: ForEachAsync = f => async xs => {
    for (const x of xs) {
        // eslint-disable-next-line no-await-in-loop
        await f(x);
    }
};

export type ExcludeFromMap = <T>(map: Record<string, T>)=>(x: string[]) => Record<string, T>
export const excludeFromMap:ExcludeFromMap = map => xs => xs.reduce((acc, x) => {
    if (acc[x]) delete acc[x];
    return acc;
}, {...map});

export type ArrayToExistenceMap = (xs:any[]) => Record<string, boolean>
export const arrayToExistenceMap: ArrayToExistenceMap = xs => xs.reduce((acc, x) => {
    acc[x] = true;
    return acc;
}, {});

export type SplitByLines = (x: string) => string[]
export const splitByLines: SplitByLines = list => list.split('\n');
export type ReplaceBy = (re: RegExp, to: string) => (x: string) => string
export const replaceBy: ReplaceBy = (re, to) => x => x.replace(re, to);

export type GetReportName = () => string
export const getReportName:GetReportName = () => {
    const date = new Date();
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}__${
        date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
};

export type ReportWrite = (params: {content:string[], taskName:string, host:string}) => Promise<any>
export const reportWrite: ReportWrite = async ({content, taskName, host}) => {
    const reportsPath = './reports';
    const taskPath = `${reportsPath}/${taskName}`;
    const taskHost = `${taskPath}/${host}`;
    if (!existsSync(reportsPath)) await fs.mkdir(reportsPath);
    if (!existsSync(taskPath)) await fs.mkdir(taskPath);
    if (!existsSync(taskHost)) await fs.mkdir(taskHost);
    return fs.writeFile(`${taskHost}/${getReportName()}.txt`, content.join('\n'), 'utf8');
};

export type Runner = (params: {taskName:string, sniffer: Sniffer}) => (host:string) => Promise<any>
export const runner: Runner = ({taskName, sniffer}) => async host => {
    console.log('HOST: ', host);
    const bash = connector({host});
    const bashRemove = removeRecByPath(bash);
    console.log('Gathering paths...');
    const paths = await sniffer({host});
    console.log('Deleting...');
    const report:string[] = [taskName, `HOST: ${host}`];
    if (!paths.length) {
        const nothingMsg = 'nothing to delete';
        console.log(nothingMsg);
        report.push(nothingMsg);
    }
    const duBefore = await getDiskUsage(bash)();
    return forEachAsync(async (path:string) => {
        await bashRemove(path, '/');
        const msg = `deleted: ${path}`;
        report.push(msg);
        console.log(msg);
    })(paths)
        .catch(err => report.push(err))
        .finally(async () => reportWrite({
            taskName,
            host,
            content: report.concat([
                'DISK USAGE BEFORE:',
                duBefore,
                'DISK USAGE AFTER:',
                await getDiskUsage(bash)()
            ]),
        }).catch(console.log));
};
