import {promises as fs} from 'fs';

const flatClone = (x: any) => {
    if (isObject(x)) return {...x};
    if (isArray(x)) return [...x];
    return x;
};

export type Reduce = <Acc, X>(f: (acc: Acc, x: X) => Acc, acc: Acc) => (xs: X[]) => Acc
export const reduce: Reduce = (f, acc) => xs => xs.reduce(f, flatClone(acc));

export type ReduceAsync = <Acc, X>(f: (acc: Acc, x: X) => Promise<Acc>, acc: Acc) => (xs: X[]) => Promise<Acc>
export const reduceAsync: ReduceAsync = (f, acc) => async xs => {
    for (const x of xs) {
        // eslint-disable-next-line no-param-reassign,no-await-in-loop
        acc = await f(acc, x);
    }
    return acc;
};

export type MapAsync = <X extends string, K>(f: (x: X) => Promise<K>) => (xs: X[]) => Promise<Record<X, K>>
export const mapAsync: MapAsync = f => async xs => {
    const result:Record<string, any> = {};
    for (const x of xs) {
        // eslint-disable-next-line no-await-in-loop
        result[x] = await f(x);
    }
    return result;
};

type MapifyArray = (key: string, prop?: string) => (data: Record<string, any>[]) => Record<string, any>
export const mapifyArray: MapifyArray = (key, prop) => reduce((acc, o: any) => {
    acc[o[key]] = prop ? o[prop] : o;
    return acc;
}, {} as Record<string, string>);

export type ExcludeFromMap = <T>(map: Record<string, T>) => (x: string[]) => Record<string, T>
export const excludeFromMap: ExcludeFromMap = map => xs => xs.reduce((acc, x) => {
    if (acc[x]) delete acc[x];
    return acc;
}, {...map});

export type ArrayToExistenceMap = (xs: any[]) => Record<string, boolean>
export const arrayToExistenceMap: ArrayToExistenceMap = xs => xs.reduce((acc, x) => {
    acc[x] = true;
    return acc;
}, {});

export type SplitByLines = (x: string) => string[]
export const splitByLines: SplitByLines = x => x.split('\n');
export type SplitBySpaces = (x: string) => string[]
export const splitBySpaces: SplitBySpaces = x => x.split(' ');
export type ReplaceBy = (re: RegExp, to: string) => (x: string) => string
export const replaceBy: ReplaceBy = (re, to) => x => x.replace(re, to);

export const localCompare = Function.prototype.call.bind(String.prototype.localeCompare);

export type AnyToAnyT = (...xs: any) => any;
export type AnyToAny2T = (...xs: any) => AnyToAnyT;
export type AnyToAny3T = (...xs: any) => AnyToAny2T;
export type AnyToAny4T = (...xs: any) => AnyToAny3T;

type IType = <T>(x: T) => T
export const I: IType = x => x;

type TType = <T, K>(x?: T) => (f:(_x?: T) => K) => K
export const T:TType = x => f => f(x);

type PipeSyncReducer = <Arg, First, Second>(acc: (x: Arg) => First, f: (x: First) => Second) => (x: Arg) => Second
const pipeSyncReducer: PipeSyncReducer = (acc, f) => x => f(acc(x));

type PipeSync = (xs: AnyToAnyT[]) => AnyToAnyT
export const pipeSync: PipeSync = xs => xs.reduce(pipeSyncReducer, I);

type PipeReducer = <Arg, First, Second>(
    acc: (x: Arg) => Promise<First>, f: (x: First) => Promise<Second>
) => (x: Arg) => Promise<Second>
const pipeReducer: PipeReducer = (acc, f) => async x => f(await acc(x));

type Pipe = (xs: AnyToAnyT[]) => AnyToAnyT
export const pipe: Pipe = xs => xs.reduce(pipeReducer, I);

type ParallelSyncReducer = <Arg, First, Second>(
    ...xs: Arg[]
) => (acc: (x: First) => Second, f: (..._xs: Arg[]) => First) => Second

export const parallelSyncReducer: ParallelSyncReducer = (...xs) => (acc, f) => acc(f(...xs));

type ParallelSync = (joiner: AnyToAnyT) => (xs: AnyToAnyT[]) => AnyToAnyT;

export const parallelSync: ParallelSync = joiner => fns => (...xs) => fns.reduce(parallelSyncReducer(...xs), joiner);

type ParallelReducer = <Arg>(
    ...xs: Arg[]
) => <First, Second>(
    acc: (x: First) => Promise<Second>,
    f: (..._xs: Arg[]) => Promise<First>
) => Promise<Second>

export const parallelReducer: ParallelReducer = (...xs) => async (acc, f) => acc(await f(...xs));

type Parallel = (joiner: AnyToAnyT) => AnyToAny2T

export const parallel: Parallel = joiner => fns => (...xs) => fns.reduce(parallelReducer(...xs), joiner);

type Info = (msg: string) => <Arg>(x: Arg) => Arg
export const info: Info = msg => x => {
    console.log(msg);
    return x;
};
type Log = <Arg>(x: Arg) => Arg
export const log: Log = x => {
    console.log(x);
    return x;
};

type ProcessExit = () => void
export const processExit0: ProcessExit = () => process.exit(0);
export const processExit1: ProcessExit = () => process.exit(1);

type TypeOf = (x: any) => string
export const typeOf: TypeOf = x => Object.prototype.toString.call(x).slice(8, -1).toLowerCase();

type IsObject = (x: any) => boolean
export const isObject: IsObject = x => typeOf(x) === 'object';
type IsArray = (x: any) => boolean
export const isArray: IsArray = x => typeOf(x) === 'array';

type MergeFlat = <O1, O2>(o1: Record<string, O1>)=>(o2: Record<string, O2>) => Record<string, O1|O2>
export const mergeFlat:MergeFlat = o1 => o2 => ({...o1, ...o2});

type DebugToFile = <Arg>(data: Arg) => Promise<Arg>
export const debugToFile: DebugToFile = async data => {
    await fs.writeFile('reports/debug.txt', JSON.stringify(data, null, '    '), 'utf8');
    return data;
};

type CatchAsync = <Arg>(f: (err: any) => any) => (x: Promise<Arg>) => Promise<Arg>
export const catchAsync: CatchAsync = f => x => x.catch(f);

type Stringify = (x: any) => string
export const stringify: Stringify = x => JSON.stringify(x, null, '    ');
