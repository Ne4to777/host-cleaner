import {appendFileSync, existsSync, mkdirSync} from 'fs';

export type GetUniqueFilename = () => string
export const getUniqueFilename: GetUniqueFilename = () => {
    const date = new Date();
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}__${
        date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
};

export type Reduce = (accGetter: () => any) => (f: (_acc: any) => (x: any) => any) => (xs: any[]) => any
export const reduce: Reduce = accGetter => f => xs => xs.reduce((_acc, x) => f(_acc)(x), accGetter());

export type ReduceAsync = (accGetter: () => any) => (
    f: (_acc: any) => (x: any) => Promise<any>
) => (xs: any[]) => Promise<any>
export const reduceAsync: ReduceAsync = accGetter => f => async xs => {
    let acc = accGetter();
    for (const x of xs) {
        // eslint-disable-next-line no-param-reassign,no-await-in-loop
        acc = await f(acc)(x);
    }
    return acc;
};

export type MapifyAsync = <X extends string, K>(f: (x: X) => Promise<K>) => (xs: X[]) => Promise<Record<X, K>>
export const mapifyAsync: MapifyAsync = f => async xs => {
    const result:Record<string, any> = {};
    for (const x of xs) {
        // eslint-disable-next-line no-await-in-loop
        result[x] = await f(x);
    }
    return result;
};

type MapifyArray = (key: string, prop?: string) => (data: Record<string, any>[]) => Record<string, any>
export const mapifyArray: MapifyArray = (key, prop) => reduce(() => ({}))(acc => o => {
    acc[o[key]] = prop ? o[prop] : o;
    return acc;
});

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
export const splitByLines: SplitByLines = x => x
    .replace(/(\n)+/g, '\n')
    .replace(/^\n/, '')
    .replace(/\n$/, '')
    .split('\n');

export type SplitBySpaces = (x: string) => string[]
export const splitBySpaces: SplitBySpaces = x => x.split(' ');
export type ReplaceBy = (re: RegExp, to: string) => (x: string) => string
export const replaceBy: ReplaceBy = (re, to) => x => x.replace(re, to);

type IType = <T>(x: T) => T
export const I: IType = x => x;

type KType = <T>(x: T) => () => T
export const K: KType = x => () => x;
type K2Type = <T>(x: T) => () => () => T
export const K2: K2Type = x => K(() => x);

type CType = <T, L, N>(f: any) =>(y?: T) => (x?: L) => N
export const C:CType = f => y => x => f(x)(y);

type TType = <T, L>(x?: T) => (f:(_x?: T) => L) => L
export const T:TType = x => f => f(x);

type Info = (msg: any) => <Arg>(x: Arg) => Arg
export const info: Info = msg => x => {
    if (process.env.NODE_ENV !== 'TESTING') {
        console.log(typeof msg === 'function' ? msg(x) : msg);
    }
    return x;
};
type Log = <Arg>(x: Arg) => Arg

export const debug: Log = x => {
    console.log(x);
    return x;
};

export const log: Log = x => {
    if (process.env.NODE_ENV !== 'TESTING') console.log(x);
    return x;
};

type Log2 = <Arg1, Arg2>(x: Arg1) => (y: Arg2) => Arg2
export const log2: Log2 = x => y => {
    console.log(x);
    console.log(y);
    return y;
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

type DebugToFile = <Arg>(path: string) => (data: Arg) => Arg
export const debugToFile: DebugToFile = path => data => {
    const folderPath = `debug/${path}`;
    if (!existsSync(folderPath)) mkdirSync(folderPath, {recursive: true});
    appendFileSync(`${folderPath}/logs.txt`, `${data}\n`, 'utf8');
    return data;
};
type DebugCommandsToFile = <G, F>(command: G, folder: F, host: string) => any
export const debugCommandsToFile: DebugCommandsToFile = (
    command,
    folder,
    host,
) => debugToFile(`commands/${host}`)(`command: '${command}' in '${folder}'`);

type LogToFile = (data: any) => any
export const logToFile: LogToFile = data => debugToFile('temp')(JSON.stringify(data, null, '    '));

type CatchAsync = <Arg>(f: (err: any) => any) => (x: Promise<Arg>) => Promise<Arg>
export const catchAsync: CatchAsync = f => x => x.catch(f);

type Stringify = (x: any) => string
export const stringify: Stringify = x => JSON.stringify(x, null, '    ');

type TNull = (x?: any) =>null
export const NULL: TNull = () => null;

export type Pipe = (...fns: Array<(x?: any) => any>) => (x?: any) => any

export type Para = (...fns: Array<(x?: any) => any>) => (x?: any) => any
export type Para2 = (...fns: Array<(x?: any) => (y?: any) => any>) => (x?: any) => (y?: any) => any

export type Parapipe = (...fns: Array<(x?: any) => (y?: any) => any>) => (...xs: any[]) => (...ys: any[]) => any

export type SideSync = <X>(f: (x?: X) => any) => (x?: X) => X | void
export type SideAsync = <X>(f: (x?: X) => any) => (x?: X) => Promise<X | void>
export type Side = <X>(f: (x?: X) => any) => (x?: X) => X | void | Promise<X | void>

/**
 * Pipe Synchronous
 */
export const pipeSync: Pipe = (...fns) => x => {
    let res = x;
    for (let i = 0; i < fns.length; i += 1) res = fns[i](res);
    return res;
};
/**
 * Pipe Asynchronous
 */
export const pipeAsync: Pipe = (...fns) => async x => {
    let res = x;
    // eslint-disable-next-line no-await-in-loop
    for (let i = 0; i < fns.length; i += 1) res = await fns[i](res);
    return res;
};
/**
 * Pipe Autodetect
 */
export const pipe: Pipe = (...fns) => x => {
    let res = x;
    for (let i = 0; i < fns.length; i += 1) res = res instanceof Promise ? res.then(fns[i]) : fns[i](res);
    return res;
};
/**
 * Parallel Synchronous
 */
export const paraSync: Para = (...fns) => x => {
    const res = [];
    for (let i = 0; i < fns.length; i += 1) res[i] = fns[i](x);
    return res;
};
/**
 * Parallel Asynchronous
 */
export const paraAsync: Para = (...fns) => async x => {
    const res = [];
    // eslint-disable-next-line no-await-in-loop
    for (let i = 0; i < fns.length; i += 1) res[i] = await fns[i](x);
    return res;
};
/**
 * Parallel Autodetect
 */
export const para: Para = (...fns) => x => {
    const res = [];
    let hasPromise = false;

    for (let i = 0; i < fns.length; i += 1) {
        res[i] = fns[i](x);
        if (res[i] instanceof Promise) {
            hasPromise = true;
            break;
        }
    }

    if (!hasPromise) return res;

    for (let i = res.length; i < fns.length; i += 1) res[i] = fns[i](x);

    return Promise.all(res);
};
/**
 * Parallel 2 args Autodetect
 */
export const para2: Para2 = (...fns) => x => y => {
    const res = [];
    let hasPromise = false;

    for (let i = 0; i < fns.length; i += 1) {
        res[i] = fns[i](x)(y);
        if (res[i] instanceof Promise) {
            hasPromise = true;
            break;
        }
    }

    if (!hasPromise) return res;

    for (let i = res.length; i < fns.length; i += 1) res[i] = fns[i](x)(y);

    return Promise.all(res);
};
/**
 * Parallel first, Pipe Second Synchronous
 */
export const parapipeSync: Parapipe = (...fns) => x => pipeSync(...paraSync(...fns)(x));
/**
 * Parallel first, Pipe Second Asynchronous
 */
export const parapipeAsync: Parapipe = (...fns) => x => pipeAsync(...paraAsync(...fns)(x));
/**
 * Parallel first, Pipe Second Autodetect
 */
export const parapipe: Parapipe = (...fns) => x => pipe(...para(...fns)(x));
/**
 * Side Synchronous
 */
export const sideSync: SideSync = f => x => {
    f(x);
    return x;
};
/**
 * Side Asynchronous
 */
export const sideAsync: SideAsync = f => async x => {
    await f(x);
    return x;
};
/**
 * Side Autodetect
 */
export const side: Side = f => x => (res => res instanceof Promise ? res.then(() => x) : x)(f(x));

type ToPipe = (...fs: ((x?: any) => any)[]) => () => Pipe
export const toPipe: ToPipe = (...fs) => () => pipe(...fs);
type Uncurry = (f: (x?: any) => any) => (xs: any[]) => any
export const uncurry: Uncurry = f => xs => xs.reduce((acc, x) => acc(x), f);

type Reduce2Async = (accGetter: () => any) => (f: (x?: any) => any) => (g: (x?: any) => any) => (x: any) => Promise<any>
export const reduce2Async: Reduce2Async = accGetter => f => g => reduceAsync(accGetter)(
    acc => x => f(x).then(reduceAsync(() => acc)(_acc => g(_acc)(x))),
);
