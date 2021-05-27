import {forEachAsync, initEnv, runner} from '../utils';
import {getDismissedUsersPaths} from '../sniffers';
import configs from '../configs';

const {hosts} = configs;

initEnv();

const run = async () => {
    console.log('TASK: Remove Dismissed User Directories');
    await forEachAsync(runner({
        taskName: 'DismissedUsers',
        sniffer: getDismissedUsersPaths
    }))(hosts);
    console.log('Task has done!');
    process.exit(0);
};

run().finally(() => process.exit(1));
