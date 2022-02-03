import {reportWrite, TotalRunner} from '../helpers';
import {info, mapifyAsync, mapifyArray, pipe, pipeSync, reduce, T, catchAsync, stringify} from '../utils';
import {getUsersByIds, sendEmail} from '../api';

const report: string[] = [];
const pushReport = (x: any) => {
    report.push(stringify(x));
    return x;
};

export const mailer: TotalRunner = ({name, configs, formatter}) => pipe(
    Object.entries,
    reduce(() => ({}))(
        acc => ([host, loginsMap]) => reduce(() => acc)(
            _acc => ([login, servicesMap]) => {
                if (!_acc[login]) _acc[login] = {};
                _acc[login][host] = servicesMap;
                return _acc;
            },
        )(Object.entries(loginsMap)),
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
                        to: emailsMap[login],
                    }),
                    pipeSync(
                        data => sendEmail(configs.mode === 'real' ? data : {}),
                        catchAsync(pushReport),
                    ),
                    pushReport,
                ),
                mapifyAsync,
                T(logins),
            ),
        )(logins),
    )(dataMap),
    () => reportWrite({name, folder: 'email'})(report.join('\n')),
);
