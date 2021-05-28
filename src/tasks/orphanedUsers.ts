import {getOrphanedUsersPaths} from '../sniffers';
import {forEachAsync, runner} from '../utils';
import configs from '../configs';

const {hosts} = configs;

const run = async () => {
    console.log('TASK: ', 'Remove Orphaned User Services');
    await forEachAsync(runner({
        taskName: 'OrphanedUsers',
        sniffer: getOrphanedUsersPaths
    }))(hosts);
    console.log('Task has done!');
    process.exit(0);
};

run().finally(() => process.exit(1));
