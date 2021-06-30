// import {connector, getUsersAllArray} from './api';
// import {getDismissedUsersPaths} from './sniffers';
//
// const bash = connector({host: 'market.logrus01hd.yandex.ru'});
// getServiceUserGitBranches(bash)('/var/lib/yandex/market-front-node-dev/naygeborin').then(console.log);
// getUsersAllArray(bash)().then(console.log);

// getDismissedUsersPaths({host: 'market.logrus01ed.yandex.ru'}).then(console.log);
import {readFileSync} from 'fs';

try {
    readFileSync('', 'utf8');
} catch (err) {
    console.log(err.code);
}
