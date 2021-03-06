import type {EachRunner} from '../helpers';
import {getConnector, reportWrite} from '../helpers';
import {getDiskUsage, removeRecByPath} from '../api';
import {mapifyAsync, I, log} from '../utils';

export const cleaner: EachRunner = ({name, configs}) => host => async paths => {
    const {mode} = configs;
    const report: string[] = [name, `HOST: ${host}`];
    const bash = getConnector(configs)(host);
    const bashDiskUsage = getDiskUsage(bash);
    const bashRemove = mode === 'real' ? removeRecByPath(bash) : I;
    const write = reportWrite({name, folder: host});
    if (!paths.length) {
        const nothingMsg = 'nothing to delete';
        log(nothingMsg);
        report.push(nothingMsg);
        return write(report.join('\n'));
    }
    log(`${paths.length} item(s) found. Deleting...`);
    try {
        const duBefore = await bashDiskUsage();
        await mapifyAsync(async (path: string) => {
            try {
                process.stdout.write(`deleting: ${path}`);
                if (/\/~$/.test(path)) await bashRemove('*~*', path.split('/').slice(0, -1).join('/'));
                await bashRemove(path, '/');
                report.push(`deleted: ${path}`);
                process.stdout.write(' - done!\n');
            } catch (err: any) {
                report.push(err);
            }
        })(paths);

        report.push('DISK USAGE BEFORE:', duBefore);
        report.push('DISK USAGE AFTER:', await bashDiskUsage());

        try {
            await write(report.join('\n'));
        } catch (err) {
            log(err);
        }
    } catch (err: any) {
        await write(err.message);
    }
    return undefined;
};
