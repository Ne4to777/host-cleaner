import * as dotenv from 'dotenv';
import {NodeSSH} from 'node-ssh';

dotenv.config({path: './.env'});

const {USERNAME, PRIVATE_KEY_PATH} = process.env;
const ssh = new NodeSSH();

type Connector = (params: {host:string}) => (command:string, folder:string) => Promise<any>

export const connector:Connector = ({host}) => {
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
