// User creation
(async () => {
  console.log("Creating users...");
  let res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "foo",
      email: "foo@gmail.com",
      password: "foopassword",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "bar",
      email: "bar@gmail.com",
      password: "barpassword",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "baz",
      email: "baz@gmail.com",
      password: "bazpassword",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "qux",
      email: "qux@gmail.com",
      password: "quxpassword",
    }),
  });
  console.log(res.status);

  // Chat creation
  console.log("Creating chats...");
  res = await fetch("http://localhost:9000/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_user_id: "1",
      second_user_id: "2",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_user_id: "2",
      second_user_id: "3",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_user_id: "3",
      second_user_id: "1",
    }),
  });
  console.log(res.status);

  // Messages creation
  console.log("Creating messages...");
  res = await fetch("http://localhost:9000/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: "1",
      chat_id: "1",
      body: "this is a test message",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: "1",
      chat_id: "1",
      body: "this is another test message",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: "3",
      chat_id: "3",
      body: "this is a new test message",
    }),
  });
  console.log(res.status);

  // Tournament creation
  console.log("Creating tournaments...");
  res = await fetch("http://localhost:9000/tournaments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Test tournament",
      player_amount: 4,
      players: [1, 2, 3, 4],
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/tournaments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Another test tournament",
      player_amount: 4,
      players: [1, 2, 3, 4],
    }),
  });
  console.log(res.status);

  // Match creation
  console.log("Creating matches...");
  res = await fetch("http://localhost:9000/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      left_player_id: 1,
      right_player_id: 2,
      result: "3, 2",
      winner_id: 1,
      loser_id: 2,
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      left_player_id: 1,
      right_player_id: 2,
      result: "2, 3",
      winner_id: 2,
      loser_id: 1,
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      left_player_id: 4,
      right_player_id: 3,
      result: "3, 2",
      winner_id: 4,
      loser_id: 3,
    }),
  });
  console.log(res.status);
})();
