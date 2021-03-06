# Yandex.Практикум спринт 15

Version: v.0.3.2

## Описание

Вводный курс по бэкенду с экспрессом и монгой.

## Локальный запуск

1. Склонировать репозиторий
2. Доставить отсутствющие модули npm

    ```bash
        npm install
    ```

3. Запуск локального сервера

    ```bash
        npm run start
    ```

4. Для разработки возможен запуск с develop'оп окружением

    ```bash
        npm run dev
    ```

5. Генерация всякого

    ```bash
      npm run build:docs #документация
      npm run build:tests #lint и codequality (требуется доскер и unix-подобная среда)
      npm run build:dockerimage #упаковка приложения в docker image с тэгом mesto-backend:latest
    ```

6. Запуск в докере

    ```bash
      npm run build:dockerimage
      docker run -it --rm -p 3000:3000 -e MONGODB_URI=mongodb://db:27017/mestodb mesto-backend:latest
    ```

7. Если очень лениво, но есть docker-compose, то можно

    ```bash
      docker-compose build
      docker-compose up
    ```

## Переменные окружения

* `PORT` - порт, на котором будет запущено приложение, по-умолчанию 3000
* `MONGODB_URI` - URI базы, по-умолчанию
* `JWT_SECRET` - JWT secret
* `AUTH_STRATEGY` - стратегия авторизации. Допустимые варианты: `bearer` или `cookie`
* `LOGS_TYPE` - транспорт, куда выкидывать логи: `tty` (консоль) или `file`
* `LOGS_DIR` - директория, куда логи складывать (применяется, если `LOGS_TYPE=file`)
* `LOGS_FORMAT` - формат логов: `json` или `short`
