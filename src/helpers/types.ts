export type Sniffer = (configs: any)=> (host: string) => Promise<any>

export type GetUserServicesArrayNewerThen = (n:any) => (bash: (...xs:any) => any) => (path: string) => Promise<string>

export type HostsIterator =(params: any) => Promise<any>

export type Task = {
    name: string,
    sniffer: Sniffer,
    mailer?: (login:string, data: any) => string,
    configs: Record<string, any>
}

export type RunnerWithParams = (x: any) => Promise<any>
export type Runner = (params: any) => RunnerWithParams

export type HostRunnerWithParams = (host: string) => Promise<any>
export type HostRunner = (params: any) => HostRunnerWithParams

export type ReportWrite = (params: { name: string, folder: string }) => (content: string) => Promise<any>

export type GetServiceInfoMap = (xs: string[])=> Record<string, string>

export type GetTask = (params: any) => (x: any) => any
