export type VoidToArrayAsync = (bash: (...xs: any) => any) => () => Promise<string[]>
export type Sniffer = (params: any) => Promise<any>

export type GetUsersExistServices = (bash: (...xs:any) => any) => (usersSymlinks: string[]) => Promise<string[]>

export type GetServicesInfo = (bash: (...xs:any) => any) => (path: string) => Promise<string[]>

export type TrimLoginSuffix = (x:string) => string
export type GetDoublesByLoginsMap = (refIndex:number) => (xs: string[]) => Record<string, string[]>

export type HostsIterator = (runner: (host: string) => Promise<any>) => Promise<any>

export type Task = {
    name: string,
    sniffer: Sniffer
}

export type RunnerWithParams = (x: any) => Promise<any>
export type Runner = (task: Task) => RunnerWithParams

export type HostRunnerWithParams = (host: string) => Promise<any>
export type HostRunner = (task: Task) => HostRunnerWithParams

export type ReportWrite = (params: { task: Task, folder: string }) => (content: string) => Promise<any>
