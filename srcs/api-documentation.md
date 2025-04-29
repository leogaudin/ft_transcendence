# Documentación API Transcendence

<!--toc:start-->
- [Documentación API Transcendence](#documentación-api-transcendence)
  - [Ejemplos](#ejemplos)
  - [Endpoints](#endpoints)
    - [Auntentificación](#auntentificación)
      - [2FA](#2fa)
    - [Usuarios](#usuarios)
    - [Relaciones](#relaciones)
    - [Avatares](#avatares)
    - [Chats](#chats)
    - [Mensajes](#mensajes)
    - [Torneos](#torneos)
    - [Partidas](#partidas)
<!--toc:end-->

## Ejemplos

```js
let res = await fetch("https://localhost:8443/api/users", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
});
if (!res.ok) handleError();

let res = await fetch("https://localhost:8443/api/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
  body: JSON.stringify({
    sender_id: "1",
    chat_id: "1",
    body: "this is a test message",
  }),
});
if (!res.ok) handleError();
```

Si quieres ver más, cf. `srcs/backend/api/dev/dummy.js`

## Endpoints

Todos los endpoints están precedidos de <https://localhost:8443/api>
Esta conexión está controlada por Nginx en el contenedor del frontend,
que lo redirige al backend, actuando como proxy

La estructura de la documentación es la siguiente:

`METODO` `/endpoint` `parámetros requeridos` Descripción

```json
{
  "respuesta": "a la petición"
}
```

### Auntentificación

Estos endpoints devuelven un JWT / no necesitan un JWT

`POST` `/login` `{username, password, ?totp}` Loguea al usuario,
devuelve toda la info del usuario.

```json
{
  "id": 1,
  "username": "debug",
  "alias": null,
  "email": "debug@gmail.com",
  "avatar": "/usr/transcendence/api/avatars/default.jpg",
  "created_at": "2025-02-21 11:03:03",
  "is_online": 1,
  "last_login": "2025-02-21 11:03:03",
  "reset_token": null,
  "is_deleted": 0,
  "wins": 0,
  "losses": 0,
  "token": "verylongandsecurejwt"
}
```

`POST` `/google/login` `{credential}` Loguea al usuario a
través de Google, creando su cuenta
o accediendo a una existente

Si el usuario existe, el resultado es idéntico al endpoint `/login`,
si no existe, el resultado es idéntico al endpoint `/register`

`POST` `/register` `{username, email, password, confirm_password}` Registra al usuario

```json
{
  "id": 1,
  "username": "debug",
  "email": "debug@gmail.com",
  "token": "verylongandsecurejwt"
}
```

`POST` `/reset` `{email}` Manda un correo al usuario para resetear su contraseña

```json
{
  "accepted": ["user@mail.com"],
  "rejected": [],
  "ehlo": [
    "SIZE 35882577",
    "8BITMIME",
    "AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH",
    "ENHANCEDSTATUSCODES",
    "PIPELINING",
    "CHUNKING",
    "SMTPUTF8"
  ],
  "envelopeTime": 521,
  "messageTime": 587,
  "messageSize": 1042,
  "response": "250 2.0.0 OK  1741175147 ffacd0b85a97d-390e485db82sm20400744f8f.88 - gsmtp",
  "envelope": {
    "from": "transcendence42mlg@gmail.com",
    "to": ["user@mail.com"]
  },
  "messageId": "<0537e65e-6dff-d162-b271-ccfed0392b61@gmail.com>"
}
```

`POST` `/resetToken` `{token, id, password, confirm_password}` Actualiza la contraseña
del usuario si el token de reseteo es correcto

#### 2FA

El endpoint para loguear a un usuario con 2FA es el mismo que
el logueo normal (/login).
Si el usuario ha activado 2FA previamente, se pedirá un TOTP.
Si no se encuentra el token TOTP, el servidor responderá con
`CODE 202` `{message: "2FA is enabled, TOTP code required"}`.
Si se encuentra el token TOTP, se procederá al login de forma habitual,
comprobando el token en el proceso

`GET` `/2fa/enable` Empieza la activación de 2FA

```json
{
  "qr_code": "data:image/png;base64..."
}
```

El usuario deberá escanear el QR y registrarlo con una aplicación para
obtener un código de contraseña temporal (TOTP)

`POST` `/2fa/verify` `{totp_code}` Finaliza la activación del 2FA

```json
{
  "success": "2FA successfully enabled for user with ID 1"
}
```

### Usuarios

`GET` `/users/list` Devuelve el id, username y email de todos los usuarios

```json
[
  {
    "id": 2,
    "username": "foo",
    "email": "foo@gmail.com"
  },
  {
    "id": 3,
    "username": "bar",
    "email": "bar@gmail.com"
  }
]
```

`POST` `/users` `{username, password, email}` Crea un usuario directamente

```json
{
  "id": 1,
  "username": "foo",
  "email": "foo@gmail.com"
}
```

`GET` `/users` Devuelve toda la información de un usuario

```json
{
  "id": 1,
  "username": "debug",
  "alias": null,
  "email": "debug",
  "avatar": "/usr/transcendence/api/avatars/default.jpg",
  "created_at": "2025-02-18 11:39:16",
  "is_online": 0,
  "last_login": "2025-02-18 11:39:16",
  "reset_token": null,
  "wins": 0,
  "losses": 0,
  "friends": [2, 3, 4]
}
```

`PUT` `/users` `{username, password, email}` Modifica completamente un usuario

```json
{
  "id": 1,
  "username": "foo",
  "email": "foo@gmail.com"
}
```

`PATCH` `/users` `{?, ...}` Modifica uno o más campos de un usuario.
Devuelve los campos modificados.

```json
{
  "email": "foo@gmail.com"
}
```

`PATCH` `/users/password` `{current_password, new_password, new_password_confirm}`
Modifica la contraseña del usuario. Se encarga de comprobar que la contraseña
actual es la correcta, que la nueva es diferente y que sea hasheada en la DB

```json
{
  "success": "Password successfully changed"
}
```

`DELETE` `/users` Borra un usuario

`GET` `/users/:str` Devuelve la tabla _str_ en relación al usuario,
donde _str_ puede ser _chats_, _messages_, _matches_ o _tournaments_.
cf. la tabla en cuestión para ver lo que devuelve

`POST` `/users/search` `{username}` Busca usuarios que comiencen por el nombre dado

```json
{
  "user_id": 1,
  "username": "foo",
  "avatar": "/ruta/al/avatar.jpg",
  "is_friend": 1
}
```

### Relaciones

Estos endpoints tratan de las relaciones entre usuarios

`POST` `/users/friends` `{friend_id}` Añade un amigo al usuario como pendiente

```json
{
  "user_id": "1",
  "friend_id": "2"
}
```

`POST` `/users/friends/confirm` `{friend_id}` Confirma la petición de amistad

```json
{
  "success": true,
  "user_id": 1,
  "friend_id": 2,
  "pending": false
}
```

`GET` `/users/friends` Devuelve todos los amigos del usuario

```json
[
  {
    user_id:1,
    username:bar,
    status:"hello world",
    avatar:"/ruta/al/avatar.jpg",
    is_online: 1
  },
  {
    user_id:2,
    username:baz,
    status:"hello world",
    avatar:"/ruta/al/avatar.jpg",
    is_online: 1
  },
]
```

`GET` `/users/friends/:id` Devuelve el perfil detallado de un amigo

```json
{
  user_id:1,
  username:foo,
  alias:foo_alias,
  status: "hello world",
  avatar: "/ruta/al/avatar.jpg",
  is_online: 1,
  pong_games_played: 4,
  pong_games_won: 2,
  pong_games_lost: 2,
  connect_four_games_played: 2,
  connect_four_games_won: 1,
  connect_four_games_lost: 1,
}
```

`GET` `/users/invitations` Devuelve las invitaciones pendientes del usuario

```json
[
  {
    sender_id:1,
    sender_username:foo,
    sender_avatar: "/ruta/al/avatar.jpg",
    sender_status: "hello world",
    receiver_id:2,
    receiver_username:bar,
    receiver_avatar: "/ruta/al/avatar.jpg",
    receiver_status: "hello world",
    friend_id: 2,
    invitation_type: "sent",
  }
]
```

`PATCH` `/users/friends` `{friend_id}` Borra un amigo del usuario

```json
{
  "success": "friend removed"
}
```

`POST` `/users/blocks` `{blocked_id}` Añade un usuario a la lista de
bloqueados de otro usuario

```json
{
  "user_id": 1,
  "blocked_id": 2
}
```

`PATCH` `/users/blocks` `{blocked_id}` Elimina un usuario de la lista de
bloqueados de otro usuario

```json
{
  "success": "block removed"
}
```

### Avatares

`POST` `/avatar` Modifica el avatar del usuario.
Debe incluir `multipart/form-data` en los headers de la request

```json
{
  "message": "File uploaded successfully",
  "id": "1",
  "fileDetails": {
    "filename": "1740139573122-crab.jpg",
    "originalName": "crab.jpg",
    "mimetype": "image/jpeg",
    "size": 54956
  }
}
```

### Chats

`GET` `/chats` Devuelve el id y usuarios de todos los chats

```json
[
  {
    "id": 1,
    "first_user_id": 1,
    "second_user_id": 2
  },
  {
    "id": 2,
    "first_user_id": 2,
    "second_user_id": 3
  },
  {
    "id": 3,
    "first_user_id": 1,
    "second_user_id": 3
  }
]
```

`POST` `/chats` `{first_user_id, second_user_id}` Crea un chat

```json
{
  "id": 1,
  "first_user_id": 1,
  "second_user_id": 2
}
```

`GET` `/chats/:id` Devuelve toda la información de un chat

```json
{
  "id": 1,
  "first_user_id": 1,
  "second_user_id": 2
}
```

`PUT` `/chats/:id` `{first_user_id, second_user_id}` Modifica completamente un chat

```json
{
  "id": 1,
  "first_user_id": 1,
  "second_user_id": 2
}
```

`PATCH` `/chats/:id` `{?, ...}` Modifica uno o más campos de un chat.
Devuelve los campos modificados

```json
{
  "first_user_id": 1
}
```

`DELETE` `/chats/:id` Borra un chat

`GET` `/chats/last` Devuelve todos los chats del usuario con el
último mensaje de cada uno

```json
[
  {
    "chat_id": 2,
    "friend_username": "2alvegag",
    "sender_username": "alvegag",
    "body": "Test message from alvegag number 4",
    "sent_at": "2025-04-04 19:15:47"
  },
  {
    "chat_id": 3,
    "friend_username": "albagar4",
    "sender_username": "alvegag",
    "body": "Test message from alvegag number 4",
    "sent_at": "2025-04-04 19:15:47"
  },
  {
    "chat_id": 4,
    "friend_username": "ncruzg",
    "sender_username": "alvegag",
    "body": "Test message from alvegag number 4",
    "sent_at": "2025-04-04 19:15:47"
  }
]
```

`POST` `/chats/identify` `{friend_id}` Devuelve el ID del chat entre dos usuarios,
creándolo si no existe

```json
{
  "id": 1
}
```

`GET` `/chats/identify/:id` Devuelve toda la información acerca de un chat

```json
{
  "id": 1,
  "first_user_id": 1,
  "second_user_id": 2,
  "first_user_username": "albagar4",
  "second_user_username": "2albagar4",
  "friend_id": 1
}
```

### Mensajes

`GET` `/messages` Devuelve el id, id del usuario que mandó el mensaje,
id del chat al que pertenece, cuerpo del mensaje y fecha

```json
[
  {
    "id": 1,
    "sender_id": 1,
    "chat_id": 1,
    "body": "this is a test message",
    "sent_at": "2025-02-18 11:39:16"
  },
  {
    "id": 2,
    "sender_id": 1,
    "chat_id": 1,
    "body": "this is another test message",
    "sent_at": "2025-02-18 11:39:16"
  },
  {
    "id": 3,
    "sender_id": 3,
    "chat_id": 3,
    "body": "this is a new test message",
    "sent_at": "2025-02-18 11:39:16"
  }
]
```

`POST` `/messages` `{sender_id, chat_id, body}` Crea un mensaje

```json
{
  "id": 1,
  "sender_id": 1,
  "chat_id": 1,
  "body": "this is a test message"
}
```

`GET` `/messages/:id` Devuelve toda la información de un mensaje

```json
{
  "id": 1,
  "sender_id": 1,
  "chat_id": 1,
  "body": "this is a test message",
  "sent_at": "2025-02-18 11:39:16"
}
```

`PUT` `/messages/:id` `{sender_id, chat_id, body}` Modifica completamente un mensaje

```json
{
  "id": 1,
  "sender_id": 1,
  "chat_id": 1,
  "body": "this is a test message"
}
```

`PATCH` `/messages/:id` `{?, ...}` Modifica uno o más campos de un mensaje.
Devuelve los campos modificados

```json
{
  "body": "this is a modified message"
}
```

`DELETE` `/messages/:id` Borra un mensaje

### Torneos

`GET` `/tournaments` Devuelve el id, nombre del torneo, cantidad de jugadores e
ids de los jugadores

```json
[
  {
    "id": 1,
    "name": "Test tournament",
    "player_amount": 4,
    "player_ids": [1, 2, 3, 4]
  },
  {
    "id": 2,
    "name": "Another test tournament",
    "player_amount": 4,
    "player_ids": [1, 2, 3, 4]
  }
]
```

`POST` `/tournaments` `{name, player_limit, game_type}`
Crea un torneo. Automáticamente añade al creador como jugador

```json
{
  "tournament_id": 1,
  "tournament_name": "Giga tournament",
  "player_limit": 4,
  "game_type": "pong" | "connect_four",
  "creator_id": 3
}
```

`GET` `/tournaments/:id`
Devuelve toda la información de un torneo
Se actualiza según el torneo se juega

```json
{
  "tournament_id": 1,
  "name": "Dummy Tournament",
  "player_limit": 4,
  "status": "finished",
  "game_type": "pong",
  "creator_id": 1,
  "created_at": "2025-04-28 11:49:21",
  "started_at": "2025-04-28 11:49:21",
  "finished_at": "2025-04-28 11:49:21",
  "tournament_invitations": [
    {
      "user_id": 1,
      "status": "confirmed"
    },
    {
      "user_id": 3,
      "status": "confirmed"
    },
    {
      "user_id": 5,
      "status": "confirmed"
    },
    {
      "user_id": 7,
      "status": "confirmed"
    }
  ],
  "tournament_participants": [
    {
      "user_id": 1,
      "final_rank": 1
    },
    {
      "user_id": 3,
      "final_rank": 3
    },
    {
      "user_id": 5,
      "final_rank": 4
    },
    {
      "user_id": 7,
      "final_rank": 2
    }
  ],
  "tournament_matches": [
    {
      "match_id": 1,
      "match_status": "finished",
      "match_phase": "semis",
      "first_player_id": 1,
      "second_player_id": 3,
      "first_player_score": 10,
      "second_player_score": 5,
      "winner_id": 1,
      "loser_id": 3,
      "played_at": "2025-04-28 11:49:21"
    },
    {
      "match_id": 2,
      "match_status": "finished",
      "match_phase": "semis",
      "first_player_id": 7,
      "second_player_id": 5,
      "first_player_score": 10,
      "second_player_score": 3,
      "winner_id": 7,
      "loser_id": 5,
      "played_at": "2025-04-28 11:49:21"
    },
    {
      "match_id": 3,
      "match_status": "finished",
      "match_phase": "finals",
      "first_player_id": 1,
      "second_player_id": 7,
      "first_player_score": 10,
      "second_player_score": 5,
      "winner_id": 1,
      "loser_id": 7,
      "played_at": "2025-04-28 11:49:21"
    },
    {
      "match_id": 4,
      "match_status": "finished",
      "match_phase": "tiebreaker",
      "first_player_id": 3,
      "second_player_id": 5,
      "first_player_score": 10,
      "second_player_score": 3,
      "winner_id": 3,
      "loser_id": 5,
      "played_at": "2025-04-28 11:49:21"
    }
  ]
}
```

`POST` `/tournaments/invite` `{tournament_id, user_id}`
Invita a un jugador al torneo

```json
{
  "invitation_id": 1,
  "user_id": 1,
  "status": "pending",
  "invited_at": "2025-04-28 11:13:21"
}
```

`PATCH` `/tournaments/invite` `{tournament_id, status}`
Modifica la invitación al torneo, donde "status" puede ser "confirmed" o "denied"
También se encarga de preparar el torneo si es el último usuario, añadiendo al usuario

```json
{
  "success": "Invitation successfully modified"
}
```

`POST` `/tournaments/start` `{tournament_id}`
Empieza el torneo, generando los brackets y partidas.
Solo puede ser lanzado por el creador

```json
[
  {
    "game_type":"pong" | "connect_four",
    "first_player_id": 1,
    "second_player_id": 3,
    "tournament_id": 1,
    "phase": "semis"
  },
  {
    "game_type":"pong" | "connect_four",
    "first_player_id": 2,
    "second_player_id": 4,
    "tournament_id": 1,
    "phase": "semis"
  },
]
```

### Partidas

`POST` `/matches` `{first_player_id, second_player_id, game_type}`
Crea una partida SIN TERMINAR

```json
{
  "id": 1,
  "game_type": "pong" | "connect_four",
  "first_player_id": 2,
  "second_player_id": 1
}
```

`POST` `/matches/end` `{first_player_score, second_player_score, match_id}`
Termina una partida. Si esta partida pertenece a un torneo, y es la
última partida que queda, se generan nuevas partidas para el torneo, o
si ya se han terminado todos los brackets, finaliza el torneo y actualiza
los standings

```json
{
  "success": "Match successfully finished"
}
```
