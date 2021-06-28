import type {HostRunner} from '../helpers';
import {reportWrite} from '../helpers';
import {connector, getDiskUsage, removeRecByPath} from '../ssh';
import {mapAsync, I} from '../utils';
import config from '../configs';

const {mode} = config;

export const cleaner: HostRunner = task => async host => {
    const {name, sniffer} = task;
    const report: string[] = [name, `HOST: ${host}`];
    const bash = connector({host});
    const bashDiskUsage = getDiskUsage(bash);
    const bashRemove = mode === 'real' ? removeRecByPath(bash) : I;
    console.log('Gathering paths...');
    const paths = await sniffer({host});
    const write = reportWrite({task, folder: host});
    if (!paths.length) {
        const nothingMsg = 'nothing to delete';
        console.log(nothingMsg);
        report.push(nothingMsg);
        return write(report.join('\n'));
    }
    console.log('Deleting...');
    const duBefore = await bashDiskUsage();
    try {
        await mapAsync(async (path:string) => {
            await bashRemove(path, '/');
            const msg = `deleted: ${path}`;
            report.push(msg);
            console.log(msg);
        })(paths);
        report.push('DISK USAGE BEFORE:', duBefore);
        report.push('DISK USAGE AFTER:', await bashDiskUsage());
    } catch (err) {
        report.push(err);
    } finally {
        try {
            await write(report.join('\n'));
        } catch (err) {
            console.log(err);
        }
    }
    return undefined;
};
