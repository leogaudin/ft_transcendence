# TODO

## Backend related modules

### (M) Backend with framework

- Better error management
  - Currently if there is any error, the server responds with 500,
    no matter what exception or error gets thrown in the endpoints
- Logout endpoint (needed?)
- Invites to play matches, tournaments, chats
- Notifications of upcoming games in tournaments
- Add HTML template to password request: routing done, needs the HTML

### (m) Database for the backend

### (M) User management

### (M) Google Sign-in

- Add CLIENT_ID to the button and set the callback URI in the dashboard

### (M) Remote players

### (M) Live chat

- Websocket
- Notifications of messages

### (M) AI opponent

- Websocket

### (m) User and game stats dashboards

### (m) GDPR Compliance

- Privacy and TOS

- Blocking users preventing them seeing messages from blocked users
  - added a "user_blocks" table
  - added endpoints to add and remove blocks
  - needs further logic

### (M) 2FA and JWT

- 2FA (SMS, authenticator apps, emails)
  - Enabling of 2fa should be done,
    only thing missing is the display of the qr in the frontend
