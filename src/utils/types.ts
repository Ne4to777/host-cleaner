export type VoidToArrayAsync = (bash: (...xs:any) => any) => () => Promise<string[]>
export type Sniffer = (params:any) => Promise<string[]>
