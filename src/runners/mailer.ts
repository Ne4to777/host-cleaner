import {reportWrite, Runner} from '../helpers';
import {
    info,
    mapAsync,
    mapifyArray,
    pipe,
    pipeSync,
    reduce,
    T,
    catchAsync,
    stringify,
} from '../utils';
import {getUsersByIds, sendEmail} from '../api';
import {getEmailContent} from '../helpers/emailLayout';
import config from '../configs';

const {email: {subject}, mode} = config;

const report: string[] = [];
const pushReport = (x: any) => {
    report.push(stringify(x));
    return x;
};

export const mailer: Runner = task => pipe([
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
                        data => mode === 'real' ? sendEmail(data) : Promise.resolve(''),
                        catchAsync(pushReport),
                    ]),
                    pushReport
                ]),
                mapAsync,
                T(logins),
            ]),
        ])(logins)
    ])(dataMap),
    () => reportWrite({task, folder: 'email'})(report.join('\n')),
]);
