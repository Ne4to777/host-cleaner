import configs from '../../configs';
import type {VoidToArrayAsync} from '../../utils/types';
import {splitByLines} from '../../utils';

const {usersPath} = configs;

export const getUsersAllArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    usersPath
)
    .then(splitByLines);
