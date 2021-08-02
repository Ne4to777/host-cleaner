# Host Cleaner
Создан для автоматизации задач по освобождению места на хостах вроде logrus. 
Может как удалять ненужные файлы и папки, так и рассылать уведомления нужным пользователям

## Установка
```
git clone https://github.yandex-team.ru/nybble/host-cleaner.git && cd host-cleaner 
npm i
```

## Настройка
<b>./src/configs</b>:
- <b>servicesPath</b> - путь к сервисам на хосте (настроен для логрусов)
- <b>usersPath</b> - пусть к юзерам на хосте (настроен для логрусов)
- <b>hosts</b> - хосты (настроены для логрусов)

<b>.env</b> (создать свой):
- <b>PRIVATE_KEY_PATH</b> - путь ssh ключа (а-ля '/home/coolname/.ssh/id_rsa')
- <b>PASSPHRASE</b> - кодовая фраза для ssh (если есть)
- <b>STAFF_AUTH_TOKEN</b> - токен для Стаффа (нужен только для рассылок)

## Запуск
По умолчанию режим прогона тасок <code>mode</code> выставлен в <code>fake</code>, чтоб не удалить лишнего и не слать на почту. Когда будете уверенны в своих намерениях, поменяйте на <code>real</code> (<b>src/configs/index.ts</b>)
- `npm run task:cleanOrphanedUsers` - удалить папки сервисов на которые нет симлинков из папки юзеров
- `npm run task:cleanDismissedUsers` - удалить домашние папки уволенных сотрудников (после почистить сервисы)
- `npm run task:cleanNodeModules` - удалить все node_modules в сервисах (<b>юзать только при всемирном потопе</b>)
- `npm run task:cleanOldNodeModules` - удалить node_modules в сервисах, старше 30-ти дней
- `npm run task:mailToDoubledUsers` - разослать уведомления на почту с просьбой удалить задвоенные сервисы
- `npm run task:mailAboutGitBranches` - разослать уведомления на почту с просьбой удалить ненужные git-ветки

## Отчеты
Отчеты хранятся в папке <b>./reports</b> в виде пошаговых логов с указанием использования места до и после процедуры.
Также ход выполнения таски выводится в консоль. 
Файлы разбиваются по папкам в зависимости от хоста и таски и не перетирают друг друга. 
Почистить отчеты можно `npm run clean:reports`

## Разработка

### Отладка
`npm run watch` и работать в <b>./src/index.ts</b>. 

### Создание своей таски
1. В папке <b>./src/sniffers</b> написать функцию (сниффер), которая возвращает массив абсолютных путей под удаление
2. В папке <b>./src/tasks</b> написать таску, которая будет запускать сниффер
3. В <b>package.json</b> прописать запуск вашей таски, а-ля `"task:coolClean": "npx ts-node src/tasks/coolClean"`

## Тикет с предложениями
[MARKETFRONTECH-2682](https://st.yandex-team.ru/MARKETFRONTECH-2682)
