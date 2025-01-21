# API Documentation for ft_transcendence

## Current endpoints

- http://localhost:9000/api/add/: POST request

  - http://localhost:9000/api/add/user/

    - request

    ```javascript
    {
      "name": "foo",
      "alias": "bar",
      "password": "baz",
      "email": "foobar@gmail.com",
    }
    ```

    - return (201)

    ```javascript
    {
      "id": "x",
      "name": "foo",
      "alias": "bar",
      "email": "foobar@gmail.com",
      "wins": "y",
      "losses": "z",
    }
    ```

  - http://localhost:9000/api/add/chat/

    - request

    ```javascript
    {
      "first_user": "foo",
      "second_user": "bar",
    }
    ```

    - return (201)

    ```javascript
    {
      "id": "x",
      "first_user": "foo",
      "second_user": "bar",
    }
    ```

  - http://localhost:9000/api/add/message/

    - request

    ```javascript
    {
      "sender": "foo",
      "receiver": "bar",
      "body": "baz",
    }
    ```

    - return (201)

    ```javascript
    {
      "id": "x",
      "sender": "foo",
      "body": "bar",
    }
    ```

  - http://localhost:9000/api/add/match/

    - request

    ```javascript
    {
      "left_player": "foo",
      "right_player": "bar",
      "result": "3,2",
    }
    ```

    - return (201)

    ```javascript
    {
      "id": "x",
      "left_player": "foo",
      "right_player": "bar",
      "result": [x, y],
      "winner": "foo",
      "loser": "bar",
    }
    ```

  - http://localhost:9000/api/add/tournament/
    - request
    ```javascript
    {
      "name": "foo",
      "player_amount": "4",
      "players": ["baz","bar","qux","quux"],
    }
    ```
    - return (201)
    ```javascript
    {
      "id": "x",
      "name": "foo",
      "player_amount": "x",
      "players": ["foo", "bar", "baz", "qux"],
    }
    ```

- http://localhost:9000/api/get/: GET request

  - http://localhost:9000/api/get/user/**name**

    - return (200)

    ```javascript
    {
      "id": "x",
      "name": "foo",
      "alias": "bar",
      "email": "foobar@gmail.com",
      "wins": "y",
      "losses": "z",
    }
    ```

  - http://localhost:9000/api/get/chat/**id**

    - return (200)

    ```javascript
    {
      "id": "x",
      "first_user": "foo",
      "second_user": "bar",
      "created_at": "y",
    }
    ```

  - http://localhost:9000/api/get/message/**id**

    - return (200)

    ```javascript
    {
      "id": "x",
      "sender": "foo",
      "date": "x",
      "body": "bar",
    }
    ```

  - http://localhost:9000/api/get/match/**id**

    - return (200)

    ```javascript
    {
      "id": "x",
      "left_player": "foo",
      "right_player": "bar",
      "result": [x, y],
      "winner": "foo",
      "loser": "bar",
    }
    ```

  - http://localhost:9000/api/get/tournament/**id**
    - return (200)
    ```javascript
    {
      "id": "x",
      "name": "foo",
      "player_amount": "x",
      "players": ["foo", "bar", "baz", "qux"],
    }
    ```

- http://localhost:9000/api/delete/: DELETE request

  - http://localhost:9000/api/delete/user/
    - request
    ```javascript
    {
      "name": "foo",
    }
    ```
    - return (200)
    ```javascript
    {
      "success": "foo",
    }
    ```
  - http://localhost:9000/api/delete/chat/
    - request
    ```javascript
    {
      "id": "x",
    }
    ```
    - return (200)
    ```javascript
    {
      "success": "foo",
    }
    ```
  - http://localhost:9000/api/delete/message/
    - request
    ```javascript
    {
      "id": "x",
    }
    ```
    - return (200)
    ```javascript
    {
      "success": "foo",
    }
    ```
  - http://localhost:9000/api/delete/match/
    - request
    ```javascript
    {
      "id": "x",
    }
    ```
    - return (200)
    ```javascript
    {
      "success": "foo",
    }
    ```
  - http://localhost:9000/api/delete/tournament/

    - request

    ```javascript
    {
      "id": "x",
    }
    ```

    - return (200)

    ```javascript
    {
        "success": "foo",
    }
    ```
