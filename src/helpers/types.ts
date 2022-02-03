export type Sniffer = (configs: any) => (bash: any) => Promise<any>

export type GetUserServicesArrayNewerThen = (n:any) => (bash: (...xs:any) => any) => (path: string) => Promise<string>

export type HostsIterator = (params: any) => Promise<any>

export type TaskMeta = {
    name: string,
    description: string,
    sniffer: Sniffer | string,
    runners: {
        each?: EachRunner,
        total?: TotalRunner,
    },
    formatter?: (login: string, data: any) => string,
}

export type TotalRunnerWithParams = (x: any) => Promise<any>
export type TotalRunner = (params: any) => TotalRunnerWithParams

export type EachRunnerWithParams = (host: string) => (data: any) => Promise<any>
export type EachRunner = (params: any) => EachRunnerWithParams

export type ReportWrite = (params: { name: string, folder: string }) => (content: string) => Promise<any>

export type GetServiceInfoMap = (xs: string[])=> Record<string, string>

export type GetTask = (meta: TaskMeta) => (configs: any) => any
