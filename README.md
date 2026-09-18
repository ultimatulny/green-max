<div align="center">

# GREEN-API MAX Chat

Минимальный веб-клиент для отправки и получения текстовых сообщений в MAX через GREEN-API.

Тёмный интерфейс в стиле MAX Web, адаптивная верстка, без собственного backend и базы данных.

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

## Хранение данных

Credentials, чаты, выбранный чат и сообщения сохраняются в `sessionStorage` текущей вкладки
через Zustand `persist`.

После обновления страницы состояние восстанавливается автоматически. Кнопка выхода
очищает данные в памяти и `sessionStorage`. Хранилище ограничено сессией вкладки.

`apiTokenInstance` не сохраняется в `localStorage`, IndexedDB или URL приложения.
