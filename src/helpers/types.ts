export type VoidToArrayAsync = (bash: (...xs: any) => any) => () => Promise<string[]>
export type Sniffer = (params: any) => Promise<any>

export type GetUsersExistServices = (bash: (...xs:any) => any) => (usersSymlinks: string[]) => Promise<string[]>

export type GetServicesInfo = (bash: (...xs:any) => any) => (path: string) => Promise<string[]>

export type GetAllServiceGitBranches = (bash: any) => (path: string) => Promise<string[]>

export type GetServiceUserGitBranches = (bash: any) => (path:string) => Promise<string[]>

export type HostsIterator = (runner: (host: string) => Promise<any>) => Promise<any>

export type Task = {
    name: string,
    sniffer: Sniffer,
    mailer?: (login:string, data: any) => string
}

export type RunnerWithParams = (x: any) => Promise<any>
export type Runner = (task: Task) => RunnerWithParams

export type HostRunnerWithParams = (host: string) => Promise<any>
export type HostRunner = (task: Task) => HostRunnerWithParams

export type ReportWrite = (params: { task: Task, folder: string }) => (content: string) => Promise<any>

export type GetServiceInfoMap = (xs: string[])=> Record<string, string>
