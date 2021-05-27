import {getSymlinkAbsPath} from '../../ssh';
import {reduceAsync, replaceBy, splitByLines} from '../../utils';
import type {VoidToArrayAsync} from '../../utils/types';
import type {GetUsersExistServices} from './types';
import configs from '../../configs';

const {servicesPath, usersPath} = configs;

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

export const getUsersExistServices: GetUsersExistServices = bash => reduceAsync(
    async (acc:string[], link:string) => {
        const symlinkAbsPath = await getSymlinkAbsPath(bash)(link, usersPath);
        if (symlinkAbsPath) return acc.concat(symlinkAbsPath);
        return acc;
    }, []
);
