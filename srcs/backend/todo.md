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

- ~~[GDPR checklist](https://gdpr.eu/checklist/?cn-reloaded=1)~~
- ~~Privacy and TOS~~
- ~~Ensure there is a streamlined way for users to request the anonymization of data and
  the deletion of their account (changing all SPI to "anonymous" should be [enough](https://www.ris.bka.gv.at/Dokumente/Dsk/DSBT_20181205_DSB_D123_270_0009_DSB_2018_00/DSBT_20181205_DSB_D123_270_0009_DSB_2018_00.html]))~~
- Ensure there is a way for users to manage their local data, including
  view, update or delete personal information
- Clear, transparent communication about the user's data, with an easily accessible
  option to exercise their rights regarding data protection

- Blocking users preventing them seeing messages from blocked users
  - added a "user_blocks" table
  - added endpoints to add and remove blocks
  - needs further logic

### (M) 2FA and JWT

- 2FA (SMS, authenticator apps, emails)
  - Enabling of 2fa should be done,
    only thing missing is the display of the qr in the frontend
