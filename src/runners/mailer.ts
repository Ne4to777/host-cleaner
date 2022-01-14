import {reportWrite, Runner} from '../helpers';
import {info, mapAsync, mapifyArray, pipe, pipeSync, reduce, T, catchAsync, stringify} from '../utils';
import {getUsersByIds, sendEmail} from '../api';

const report: string[] = [];
const pushReport = (x: any) => {
    report.push(stringify(x));
    return x;
};

export const mailer: Runner = ({name, configs, formatter}) => pipe(
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
    dataMap => pipe(
        Object.keys,
        logins => pipe(
            getUsersByIds,
            mapifyArray('login', 'work_email'),
            info(`EMAILS TO SEND: ${logins.length}`),
            pipe(
                emailsMap => pipe(
                    (login: string) => ({
                        subject: configs.email.subject,
                        text: formatter(login, dataMap[login]),
                        to: emailsMap[login]
                    }),
                    pipeSync(
                        data => sendEmail(configs.mode === 'real' ? data : {}),
                        catchAsync(pushReport),
                    ),
                    pushReport
                ),
                mapAsync,
                T(logins),
            ),
        )(logins)
    )(dataMap),
    () => reportWrite({name, folder: 'email'})(report.join('\n')),
);
