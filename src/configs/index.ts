export type Config = {
    mode: 'real' | 'fake',
    servicesPath: string,
    usersPath: string,
    email: {
        host: string,
        port: number,
        from: string,
        subject: string
    },
    hosts: string[]
}

export default ({
    mode: 'fake',
    servicesPath: '/var/lib/yandex',
    usersPath: '/home',
    email: {
        host: 'outbound-relay.yandex.net',
        port: 25,
        from: 'nybble@yandex-team.ru',
        subject: 'Не оставайся в стороне! Благо само себя не нанесет',
    },
    hosts: [
        'market.logrus01ed.yandex.ru',
        'market.logrus01hd.yandex.ru',
        'market.logrus01vd.yandex.ru',
        'market.logrus02vd.yandex.ru',
    ]
}) as Config;
