# API

Base URL:

```text
http://localhost:3000/api
```

## Health

### `GET /health`

Response:

```json
{
  "status": "ok"
}
```

## Auth

### `POST /auth/register`

Request:

```json
{
  "username": "john",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "uuid",
    "username": "john"
  },
  "token": "jwt"
}
```

Also sets an HTTP-only `token` cookie.

### `POST /auth/login`

Same payload and response format as register.

### `POST /auth/logout`

Response:

```json
{
  "success": true
}
```

Clears the auth cookie.

### `GET /auth/me`

Authentication:

- cookie token or bearer token

Response:

```json
{
  "id": "uuid",
  "username": "john",
  "createdAt": "2026-04-20T00:00:00.000Z"
}
```

### `GET /auth/profile`

Alias for `GET /auth/me`.

## Sync

### `POST /sync/push`

Request:

```json
{
  "habits": [
    {
      "id": "habit-1",
      "title": "Read",
      "completedDates": ["2026-04-20"],
      "updatedAt": 1776639201419
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Habits synced to server successfully"
}
```

### `GET /sync/pull`

Response:

```json
{
  "habits": [
    {
      "id": "habit-1",
      "title": "Read",
      "userId": "uuid",
      "completedDates": ["2026-04-20"],
      "createdAt": "2026-04-20T00:00:00.000Z",
      "updatedAt": 1776639201419
    }
  ]
}
```

## Validation errors

Response shape:

```json
{
  "error": "Validation failed",
  "details": []
}
```

## Domain errors

Response shape:

```json
{
  "error": "Human readable message"
}
```
