<div align="center">

# GREEN-API MAX Chat

Минимальный веб-клиент для отправки и получения текстовых сообщений в MAX через GREEN-API.

### [🚀 Открыть DEMO](https://greenmax.171-22-130-16.sslip.io)

<br />

<img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Axios-1.20-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />

<br />

<img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
<img src="https://img.shields.io/badge/Zustand-5-443E38?style=for-the-badge" alt="Zustand" />
<img src="https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=cssmodules&logoColor=white" alt="CSS Modules" />
<img src="https://img.shields.io/badge/FSD-Architecture-0A84FF?style=for-the-badge" alt="FSD" />

</div>

## О проекте

Приложение позволяет:

- подключиться по `idInstance` и `apiTokenInstance`
- создать чат по номеру телефона
- отправлять текстовые сообщения через `SendMessage`
- получать входящие сообщения через `ReceiveNotification`
- подтверждать события через `DeleteNotification`
- получать новые сообщения через long polling
- работать с адаптивным интерфейсом в стиле MAX Web

Поддерживаются только текстовые сообщения.

## Технологии

| Технология            | Назначение           |
| --------------------- | -------------------- |
| React 19              | Интерфейс            |
| TypeScript            | Типизация            |
| Vite                  | Сборка               |
| Axios                 | HTTP-запросы         |
| TanStack Query        | Server state         |
| Zustand               | Глобальное состояние |
| CSS Modules           | Стили                |
| Lucide React          | Иконки               |
| ESLint                | Линтинг              |
| Prettier              | Форматирование       |
| Feature-Sliced Design | Архитектура          |

Структура проекта:

```text
app → pages → widgets → features → entities → shared
```

## Запуск

Требуется:

```text
Node.js >= 22.12.0
```

Установить зависимости:

```bash
npm install
```

Запустить проект:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Дополнительные команды:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run format
```

## Docker

Сборка образа и запуск на хосте с установленным Docker:

```bash
docker build -t green-max .
docker run -d --name green-max --restart unless-stopped -p 8080:80 green-max
```

Приложение будет доступно по адресу `http://<IP-хоста>:8080`.
Для подключения домена направьте reverse proxy на порт `8080` и настройте HTTPS на нём.

Dockerfile собирает приложение на Node.js 24 через `npm ci` и `npm run build`.
Готовую статику раздаёт nginx; Node.js и зависимости сборки в итоговый образ не попадают.

Если нужен другой адрес GREEN-API, передайте его во время сборки:

```bash
docker build -t green-max \
  --build-arg VITE_GREEN_API_URL=https://3100.api.green-api.com .
```

Без аргумента используется адрес по умолчанию из приложения. Переменные `VITE_*`
[подставляются при сборке Vite](https://vite.dev/guide/env-and-mode), поэтому изменение
адреса требует пересборки образа. Файлы `.env*` исключены из Docker-контекста.

Данные авторизации вводятся в интерфейсе приложения.

## Хранение данных

Credentials, чаты, выбранный чат и сообщения сохраняются в `sessionStorage` текущей вкладки
через Zustand `persist`.

После обновления страницы состояние восстанавливается автоматически. Кнопка выхода
очищает данные в памяти и `sessionStorage`. Хранилище ограничено сессией вкладки.
