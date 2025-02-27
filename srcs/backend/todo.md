# TODO

- Better error management
  - Currently if there is any error, the server responds with 500,
    no matter what exception or error gets thrown in the endpoints
- 2FA (SMS, authenticator apps, emails)
  - Needs final integration between existing login and 2fa login
  - Enabling of 2fa should be done, only thing missing is the display of the qr
- Logout endpoint (needed?)
- Blocking users preventing them seeing messages from blocked users
  - added a "user_blocks" table
  - added endpoints to add and remove blocks
  - needs further logic
- Invites to play matches, tournaments, chats
- Notifications of upcoming games in tournaments
- Notifications of messages

- Add HTML template to password request: routing done, needs the HTML
