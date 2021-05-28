# Host Cleaner
Создан для автоматизации задач по освобождению места на хостах вроде logrus. 
На данный момент реализует два алгоритма очистки:
- удаление уволенных пользователей из /home
- удаление сервисов, на которые нет симлинков из /home

## Установка
```
git clone && cd host-cleaner 
npm i
```

## Настройка
<b>./src/configs</b>:
- <b>servicesPath</b> - путь к сервисам на хосте (настроен для логрусов)
- <b>usersPath</b> - пусть к юзерам на хосте (настроен для логрусов)
- <b>hosts</b> - хосты (настроены для логрусов)

<b>.env</b>:
- <b>USERNAME</b> - ваш логин в системе (а-ля coolname)
- <b>PRIVATE_KEY_PATH</b> - путь ssh ключа (а-ля '/home/coolname/.ssh/id_rsa')
- <b>STAFF_AUTH_TOKEN</b> - токен для Стаффа

## Запуск
- `npm run task:dismissedUsers` - удалить папки уволенных сотрудников
- `npm run task:orphanedUsers` - удалить папки сервисов на которые нет симлинков из папки юзеров

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

## TODO
У многих юзеров есть задвоенные сервисы, одним из которых они скорее всего не пользуются.
Найти способ их чистить или хотя бы уведомлять юзеров о необходимости убрать лишние симлинки из своей папки.
