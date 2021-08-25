import type {HostRunner} from '../helpers';
import {reportWrite} from '../helpers';
import {connector, getDiskUsage, removeRecByPath} from '../api';
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
    await mapAsync(async (path: string) => {
        try {
<<<<<<< HEAD
            process.stdout.write(`deleting: ${path}`);
            if (/\/~$/.test(path)) await bashRemove('*~*', path.split('/').slice(0, -1).join('/'));
            await bashRemove(path, '/');
            report.push(`deleted: ${path}`);
            process.stdout.write(' - done!\n');
=======
            await bashRemove(path, '/');
            const msg = `deleted: ${path}`;
            report.push(msg);
            console.log(msg);
>>>>>>> 3e584d9c208215c22254b25706053465fb5ce122
        } catch (err) {
            report.push(err);
        }
    })(paths);

    report.push('DISK USAGE BEFORE:', duBefore);
    report.push('DISK USAGE AFTER:', await bashDiskUsage());

    try {
        await write(report.join('\n'));
    } catch (err) {
        console.log(err);
    }
    return undefined;
};
