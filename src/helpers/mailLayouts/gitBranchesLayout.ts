type GetEmailContent = (login: string, data: Record<string, Record<string, Record<string, string[]>>>) => string
export const getEmailContent: GetEmailContent = (login, data) => {
    const report = `<div>${Object
        .entries(data)
        .map(([host, services]) => `<div>${host}</div><ul>${Object
            .entries(services)
            .map(([service, folders]) => `<div>${service}</div><ul>${Object
                .entries(folders)
                .map(([folder, branches]) =>
                    `<li style="padding-top: 8px;"><div>${folder}</div><ul>${branches
                        .map((branch: string) => `<li style="padding-top: 8px;">${branch}</li>`)
                        .join('')}</ul></li>`
                )
                .join('')}</ul>`
            )
            .join('')}</ul>`
        )
        .join('')}</div>`;

    return `<!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ветки Git на логрусах</title>
            </head>
            <body>
                <h2><span style="color: #666699;">Привет!</span></h2>
                <p style="text-align: justify;">Многие из нас по своему опыту знают, каково это столкнуться с нехваткой места на логрусах. Сейчас у тебя появилась возможность освободить неможечко места для других. Нужно всего-лишь удалить ненужные git-ветки, пути которых указаны ниже.</p>
                <p style="text-align: justify;">Если по каким-то причинам письмо не соответствует назначению, напиши нам в <a href="https://t.me/joinchat/C5yyIUy9ythghPB6TfsD7w">telegram</a> или в <a href="https://yndx-market.slack.com/archives/C01ETL4F135">slack</a></p>
                <p style="text-align: right;"><em>С уважением, команда инфры Маркета.</em></p>
                <p>&nbsp;</p>
                <p><strong>&nbsp;</strong></p>
                ${report}
            </body>
            </html>`.replace(/\\n/g, '');
};
