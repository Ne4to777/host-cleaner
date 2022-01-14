import {
    get,
    getAllDismissedUsers,
    getQuery,
    getRequest,
    getUserServiceNodeModulesPath,
    removeRecByPath
} from './api';
import {
    getDismissedUsersPaths,
    getDoubledUsersPaths,
    getGitBranches, getNodeModulesPaths,
    getOldNodeModulesPaths,
    getOldServices, getOrphanedUsersPaths
} from './sniffers';
import {log, log2, para, para2, parapipe, processExit0} from './utils';
import configs from './configs';
//
// const bash = connector({host: 'market.logrus01ed.yandex.ru'});
// getServiceUserGitBranches(bash)('/var/lib/yandex/market-front-node-dev/naygeborin').then(console.log);
// getUsersAllArray(bash)().then(console.log);
console.log('\n');

// getDismissedUsersPaths(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getDoubledUsersPaths(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getGitBranches(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getNodeModulesPaths(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getOldNodeModulesPaths(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getOldServices(configs)('market.logrus01ed.yandex.ru').then(console.log);
// getOrphanedUsersPaths(configs)('market.logrus01ed.yandex.ru').then(console.log);

// getOldNodeModulesPaths({host: 'market.logrus01ed.yandex.ru'}).then(console.log);

// getUserServiceNodeModulesPath(bash)('/var/lib/yandex/market-vendor-node-dev/kachesov-a')
// .then(x => console.log(x ? 'hoho' : 'hehe'));

// @ts-ignore
// eslint-disable-next-line no-undef
// const B = f => g => x => f(g(x));
// const curry = (f: any) => {
//     const args: any = [];
//     let res: any = (x:any) => x;
//     for (let i = 0; i < f.length; i += 1) {
//         // eslint-disable-next-line no-undef,no-loop-func
//         res = (x: any) => res.bind(null, x);
//     }
//     return res;
// };
//
// const curry2 = (f: any) => (x: any) => (y: any) => f.apply(null, [x, y]);
//
// // @ts-ignore
// console.log(curry((x: any) => x)(1)(2)(3));

// const curryAdd = curry((x: any, y: any, z: any) => x + y + z);
//
// console.log(curryAdd(x: any, y: any, z: any) => x + y + z)(2)(3)(4));

// get({
//     limit: 5000,
//     query: 'department_group.id==1694 or department_group.ancestors.id==1694',
//     conditions: ['official.is_dismissed=false', 'official.is_robot=false'],
//     fields: ['login', 'official.position', 'work_email']
// })
//     .then(res => res.reduce((acc, el) => {
//         const positionRu = el.official.position.ru;
//         const positionEn = el.official.position.en;
//         const workEmail = el.work_email;
//
//         if (
//             /разработчик|архитектор|техлид|системный администратор/i.test(positionRu)
//             || /developer|system administrator/i.test(positionEn)
//         ) {
//             acc.push(workEmail);
//         }
//         return acc;
//     }, []))
//     .then(data => writeFileSync('emails.txt', data.join('\n'), 'utf-8'))
//     .then(console.log);

// removeRecByPath(bash)('*~*', '/home/nybble/~'.split('/').slice(0, -1).join('/')).then(() => processExit0());
