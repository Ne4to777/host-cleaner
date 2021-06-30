import * as dotenv from 'dotenv';
import {NodeSSH} from 'node-ssh';

import {reduceAsync, replaceBy, splitByLines, splitBySpaces} from '../utils';
import type {
    GetUsersExistServices,
    VoidToArrayAsync,
    GetServicesInfo,
    GetAllServiceGitBranches,
    GetServiceUserGitBranches
} from '../helpers';
import configs from '../configs';
import {getServiceInfoMap} from '../helpers';

const {servicesPath, usersPath} = configs;

dotenv.config({path: './.env'});

const {USERNAME, PRIVATE_KEY_PATH} = process.env;
const ssh = new NodeSSH();

type Connector = (params: {host:string}) => (command:string, folder:string) => Promise<any>

export const connector: Connector = ({host}) => {
    if (!host) throw new Error('SSH host is missed');
    const session = ssh.connect({
        host,
        username: USERNAME,
        privateKey: PRIVATE_KEY_PATH
    });
    return (command, folder = '/') => session
        .then(() => ssh.execCommand(command, {cwd: folder}))
        .then(result => result.stdout);
};

export type GetSymlinkAbsPath = (bash: (...xs:any) => any) => (link:string, dir:string) => Promise<string>
export const getSymlinkAbsPath: GetSymlinkAbsPath = bash => (link, dir) => bash(`readlink ${link}`, dir);

export type RemoveRecByPath = (bash: (...xs:any) => any) => (path:string, dir:string) => Promise<string>
export const removeRecByPath: RemoveRecByPath = bash => (path, dir) => bash(`sudo rm -rf ${path}`, dir);

export type GetDiskUsage = (bash: (...xs:any) => any) => () => Promise<string>
export const getDiskUsage: GetDiskUsage = bash => () => bash('df -h', '/');

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

export const getAllServicesArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    servicesPath
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServiceNodeModules: VoidToArrayAsync = bash => () => bash(
    'find . -name node_modules -type d -maxdepth 3',
    servicesPath
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServiceGitBranches: GetAllServiceGitBranches = bash => path => bash(
    'ls | cat | xargs -I % sh -c "cd %; git branch 2> /dev/null; cd .."',
    path
)
    .then(replaceBy(/^\s|\*/g, ''))
    .then(replaceBy(/\s+/g, ' '))
    .then(replaceBy(/\s/g, '\n'))
    .then(splitBySpaces);

export const getServiceUserGitBranches: GetServiceUserGitBranches = bash => path => bash(
    'git branch 2> /dev/null',
    path
)
    .then(replaceBy(/\*/g, ' '))
    .then(replaceBy(/^\s+/g, ''))
    .then(replaceBy(/\s{2,}/g, '\n'))
    .then((x: string) => x ? splitByLines(x) : []);

export const getUsersExistServices: GetUsersExistServices = bash => reduceAsync(
    async (acc: string[], link: string) => {
        const symlinkAbsPath = await getSymlinkAbsPath(bash)(link, usersPath);
        if (symlinkAbsPath) return acc.concat(symlinkAbsPath);
        return acc;
    }, []
);

export const getUsersAllArray: VoidToArrayAsync = bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    usersPath
)
    .then(splitByLines);

export const getServicesInfo: GetServicesInfo = bash => path => bash(
    'ls -ld */',
    path
)
    // @ts-ignore
    .then((servicesinfo: string) => servicesinfo
        .split('\n')
        .slice(1)
        .map((row:string) => getServiceInfoMap(row.replace(/\s+/g, ' ').split(' '))));
