import {getDoubledUsersPaths} from '../sniffers';
import {aggregator} from '../runners';
import {hostsIterator, reportWrite} from '../helpers';
import {
    info,
    mapAsync,
    mapifyArray,
    pipe,
    pipeSync,
    processExit0,
    reduce,
    T,
    catchAsync,
    stringify,
} from '../utils';
import {getUsersByIds, sendEmail} from '../api';
import {getEmailContent} from '../helpers/emailLayout';
import config from '../configs';

const {email: {subject}} = config;

const task = {
    name: 'DoubledUsers',
    sniffer: getDoubledUsersPaths
};

const report: string[] = [];
const pushReport = (x: any) => {
    report.push(stringify(x));
    return x;
};
const write = async (x:any) => {
    await reportWrite({task, folder: 'email'})(report.join('\n'));
    return x;
};

pipe([
    info('TASK: Notify Users With Doubled Services'),
    aggregator,
    hostsIterator,
    Object.entries,
    reduce(
        (acc, [host, loginsMap]: any[]) => reduce(
            (_acc, [login, servicesMap]: any[]) => {
                if (!_acc[login]) _acc[login] = {};
                _acc[login][host] = servicesMap;
                return _acc;
            }, acc
        )(Object.entries(loginsMap)), {} as Record<string, any>
    ),
    pushReport,
    dataMap => pipe([
        Object.keys,
        logins => pipe([
            getUsersByIds,
            mapifyArray('login', 'work_email'),
            info(`EMAILS TO SEND: ${logins.length}`),
            pipe([
                emailsMap => pipe([
                    (login: string) => ({
                        subject,
                        text: getEmailContent(login, dataMap[login]),
                        to: emailsMap[login]
                    }),
                    pipeSync([
                        sendEmail,
                        catchAsync(pushReport),
                    ]),
                    pushReport
                ]),
                mapAsync,
                T(logins),
            ]),
        ])(logins)
    ])(dataMap),
    write,
    info('Task is done!'),
    processExit0
])(task);
