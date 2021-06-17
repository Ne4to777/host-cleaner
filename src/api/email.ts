import {SMTPClient, Message} from 'emailjs';

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
                attachment: [{data: text, alternative: true}]
            }),
            (err, message) => err ? reject(err) : resolve(message)
        )
        : resolve(new Message({text: 'Email sending is skipped'}))
);

// send the message and get a callback with an error or details of the message that was sent
// client.send(new Message({
//     text: 'i hope this works',
//     from: 'ne4to777@gmail.com',
//     to: 'nybble@yandex-team.ru',
//     subject: 'testing emailjs',
// }), (err, message) => {
//     console.log(err || message);
// });
