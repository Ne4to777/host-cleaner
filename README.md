# Host Cleaner
Создан для автоматизации задач по освобождению места на хостах вроде logrus. 
Может как удалять ненужные файлы и папки, так и рассылать уведомления нужным пользователям

## Установка
```
yarn run bootstrap
```

## Настройка
<b>./src/configs</b>:
- <b>mode</b> - режим прогона (<code>fake</code> | <code>real</code>)
- <b>servicesPath</b> - путь к сервисам на хосте (настроен для логрусов)
- <b>usersPath</b> - путь к юзерам на хосте (настроен для логрусов)
- <b>daysExpired</b> - кол-во дней, после которых считать сервис устаревшим (по-умолчанию 30)
- <b>hosts</b> - хосты (настроены для логрусов)

<b>.env</b> (создать свой):
- <b>USERNAME</b> - логин пользователя на Стаффе. Нужен, если ssh в конфиге true. В Ubuntu уже прописан
- <b>PRIVATE_KEY_PATH</b> - путь ssh ключа (а-ля '/home/coolname/.ssh/id_rsa'). Нужен, если ssh в конфиге true.
- <b>PASSPHRASE</b> - кодовая фраза для ssh (если есть)
- <b>STAFF_AUTH_TOKEN</b> - токен для Стаффа. Нужен для `task:cleanDismissedUsers`

## Запуск
По умолчанию режим прогона тасок <code>mode</code> выставлен в <code>fake</code>, чтоб не удалить лишнего и не слать на почту. Когда будете уверенны в своих намерениях, поменяйте на <code>real</code> (<b>src/configs/index.ts</b>)
- `yarn run task:cleanDismissedUsers` - удалить папки уволенных сотрудников (после выполнить `task:cleanOrphanedUsers`)
- `yarn run task:cleanOrphanedUsers` - удалить папки сервисов на которые нет симлинков из папки юзеров
- `yarn run task:cleanOldNodeModules` - удалить node_modules в сервисах старше <b>daysExpired</b> дней (в крайнем случае)
- `yarn run task:cleanOldUserServices` - удалить все сервисы юзеров старше <b>daysExpired</b> дней (в крайнем случае)
- `yarn run task:cleanNodeModules` - удалить все node_modules в сервисах (<b>в крайнем случае</b>)
- `yarn run task:cleanUsersCacache` - удалить все .npm/_cacache юзеров
- `yarn run task:cleanUsersVSCode` - удалить все .vscode* юзеров
- `yarn run task:mailToDoubledUsers` - разослать уведомления на почту с просьбой удалить задвоенные сервисы
- `yarn run task:mailAboutGitBranches` - разослать уведомления на почту с просьбой удалить ненужные git-ветки

Для просмотра всех опций: `yarn run task -- --help`

## Отчеты
Отчеты хранятся в папке <b>./reports</b> в виде пошаговых логов с указанием использования места до и после процедуры.
Также ход выполнения таски выводится в консоль. 
Файлы разбиваются по папкам в зависимости от хоста и таски и не перетирают друг друга. 
Почистить отчеты можно `yarn run clean:reports`

## Разработка

### Таска
```typescript
type Task = {
    name: string,                // имя (camelCase)
    description: string,         // краткое описание
    sniffer: Function | string,  // поисковая функция или баш для хоста
    runners: {                   // колбэки, обрабатывающие данные от сниффера
        each?: Function,         // выполнится для каждого хоста
        total?: Function,        // выполнится после обхода всех хостов
    },
    formatter?: Function         // преобразователь данных для раннеров
}
```

### Отладка
`yarn run watch` и работать в <b>./src/index.ts</b>. 

Можно в конфиге выставить флаг debugCommands и логировать все баш-команды в папку debug

Для имитации пакета как зависимости можно создать песочницу (папка <b>sandbox</b>) с помощью `yarn run bootstrap:sandbox` и запускать команды от туда, например, `npx host-cleaner cleanDismissedUsers` 

### Создание своей таски
1. Продублировать таску cleanUsersCacache в массиве из <b>./src/tasks</b>
2. Заполнить по-своему <b>name</b> и <b>description</b>
3. В поле <b>sniffer</b> либо:
   - вставить поисковую команду, наподобие той, что уже там была
   - в папке <b>./src/sniffers</b> написать функцию-сниффер по аналогии и подставить ее.
     
    (<b>ВАЖНО!!!</b> Если в <b>runner</b> стоит <b>cleaner</b>, то функция должна возвращать массив абсолютных путей под удаление)
4. Прописать таску в <b>package.json/scripts</b> и <b>README.md#Запуск</b>

## Тикет с предложениями
[MARKETFRONTECH-2682](https://st.yandex-team.ru/MARKETFRONTECH-2682)
