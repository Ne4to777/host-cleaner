import {SMTPClient, Message} from 'emailjs';

import {log} from '../utils';
import config from '../configs';

const {email: {host, port, from}} = config;

const client = new SMTPClient({host, port});

type SendEmail =(params:{
    text: string,
    to: string,
    subject: string
}) => any

export const sendEmail: SendEmail = ({text, to, subject}) => new Promise(
    (resolve, reject) => (to && text && subject)
        ? client.send(
            new Message({
                text,
                from,
                to,
                subject,
                attachment: [{data: text, alternative: true}],
            }),
            (err, message) => err ? log(err.message) || reject(err) : resolve(message),
        )
        : resolve(new Message({text: 'Email sending is skipped'})),
);
