export type Config = {
    servicesPath: string,
    usersPath: string,
    hosts: string[]
}

export default ({
    servicesPath: '/var/lib/yandex',
    usersPath: '/home',
    hosts: [
        'market.logrus01ed.yandex.ru',
        'market.logrus01hd.yandex.ru',
        'market.logrus01vd.yandex.ru',
        'market.logrus02vd.yandex.ru',
    ]
}) as Config;
