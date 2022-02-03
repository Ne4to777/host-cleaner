import {reduceAsync, replaceBy, splitByLines, splitBySpaces} from '../utils';
import {getServiceInfoMap, GetUserServicesArrayNewerThen} from '../helpers';

export type GetSymlinkAbsPath = (bash: (...xs:any) => any) => (link:string, dir:string) => Promise<string>
export const getSymlinkAbsPath: GetSymlinkAbsPath = bash => (link, dir) => bash(`readlink ${link}`, dir)
    .then((path:string) => path.replace(/\n/g, ''));

export type RemoveRecByPath = (bash: (...xs:any) => any) => (path:string, dir:string) => Promise<string>
export const removeRecByPath: RemoveRecByPath = bash => (path, dir) => bash(`sudo rm -rf ${path}`, dir);

export type GetDiskUsage = (bash: (...xs:any) => any) => () => Promise<string>
export const getDiskUsage: GetDiskUsage = bash => () => bash('df -h', '/');

export type ExecBash = (configs: any) => (bash: (...xs:any) => any) => (param: any) => Promise<string[]>
export const getUsersSymlinksArray: ExecBash = ({usersPath}) => bash => () => bash(
    'find . -mindepth 2 -maxdepth 2 -regex ".+_.+" -type l',
    usersPath,
)
    .then(splitByLines);

export const getUsersAllServicesArray: ExecBash = ({servicesPath}) => bash => () => bash(
    'find . -mindepth 2 -maxdepth 2 -type d',
    servicesPath,
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServicesArray: ExecBash = ({servicesPath}) => bash => () => bash(
    'find . -mindepth 1 -maxdepth 1 -type d',
    servicesPath,
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getAllServiceNodeModulesArray: ExecBash = ({servicesPath}) => bash => () => bash(
    'find . -maxdepth 3 -name node_modules -type d',
    servicesPath,
)
    .then(replaceBy(/\.\//g, `${servicesPath}/`))
    .then(splitByLines);

export const getUserServiceNodeModulesPath: ExecBash = () => bash => path => bash(
    `find ${path} -type d -name 'node_modules' -prune`,
    '/',
)
    .then((x: string) => x ? splitByLines(x) : []);

export const getUserServicesArrayNewerThen: GetUserServicesArrayNewerThen = ({daysExpired}) => bash => path => bash(
    `find . ! -path '*/node_modules/*' ! -path '*/.git/*' -type f -mtime -${daysExpired || Infinity}`,
    path,
)
    .then(replaceBy(/\.\//g, `${path}/`))
    .then((x: string) => x ? splitByLines(x) : []);

export const getHasUserServicesArrayNewerThen: GetUserServicesArrayNewerThen = ({daysExpired}) => bash => path => bash(
    `find . ! -path '*/node_modules/*' ! -path '*/.git/*' -type f -mtime -${daysExpired || Infinity}`,
    path,
)
    .then(Boolean);

export const getAllServiceGitBranches: ExecBash = () => bash => path => bash(
    'ls | cat | xargs -I % sh -c "cd %; git branch 2> /dev/null; cd .."',
    path,
)
    .then(replaceBy(/^\s|\*/g, ''))
    .then(replaceBy(/\s+/g, ' '))
    .then(replaceBy(/\s/g, '\n'))
    .then(splitBySpaces);

export const getServiceUserGitBranches: ExecBash = () => bash => path => bash(
    'git branch 2> /dev/null',
    path,
)
    .then(replaceBy(/\*/g, ' '))
    .then(replaceBy(/^\s+/g, ''))
    .then(replaceBy(/\s{2,}/g, '\n'))
    .then((x: string) => x ? splitByLines(x) : []);

export const getUsersExistServices: ExecBash = ({usersPath}) => bash => reduceAsync(() => [])(
    acc => async link => {
        const symlinkAbsPath = await getSymlinkAbsPath(bash)(link, usersPath);
        if (symlinkAbsPath) return acc.concat(symlinkAbsPath);
        return acc;
    },
);

export const getUsersAllArray: ExecBash = ({usersPath}) => bash => () => bash(
    'ls',
    usersPath,
)
    .then(splitByLines);

export const getUsersCacacheArray: ExecBash = ({usersPath}) => bash => () => bash(
    `find ${usersPath}/*/.npm/_cacache -maxdepth 0`,
    '/',
)
    .then(splitByLines);

export const getUsersVSCodeArray: ExecBash = ({usersPath}) => bash => () => bash(
    `find ${usersPath}/*/.vscode* -maxdepth 0`,
    '/',
)
    .then(splitByLines);

export const getServicesInfo: ExecBash = () => bash => path => bash(
    'ls -ld */',
    path,
)
    // @ts-ignore
    .then((servicesinfo: string) => servicesinfo
        .split('\n')
        .slice(1)
        .map((row: string) => getServiceInfoMap(row.replace(/\s+/g, ' ').split(' '))));
