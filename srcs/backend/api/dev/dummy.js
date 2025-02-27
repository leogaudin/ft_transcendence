/**
 * @module Debug module for quick generation of test data
 */

/**
 * @param {String} name - Name of user
 */
async function debugRegister(name) {
  process.stdout.write(`Creating test user ${name}...`);
  try {
    let res = await fetch("http://localhost:9000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email: `${name}@mail.com`,
        password: `${name}password`,
        confirm_password: `${name}password`,
      }),
    });
    const body = await res.json();
    const token = body.token;
    console.log(res.status, `(${token})`);
    return { name: name, id: body.id, token: token };
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Main user
 * @param {Object} friend - Friend user
 */
async function debugFriend(user, friend) {
  process.stdout.write(`Adding friends to user ${user.name}...`);
  try {
    res = await fetch("http://localhost:9000/users/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        friend_id: friend.id,
      }),
    });
    console.log(res.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Main user
 * @param {Object} blocked - Blocked user
 */
async function debugBlock(user, blocked) {
  process.stdout.write(`Adding blocks to user ${user.name}...`);
  try {
    res = await fetch("http://localhost:9000/users/blocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        blocked_id: blocked.id,
      }),
    });
    console.log(res.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Main user
 * @param {Object} second_user - Second user
 */
async function debugChat(user, second_user) {
  process.stdout.write(
    `Creating chat between user ${user.name} and user ${second_user.name}...`,
  );
  try {
    res = await fetch("http://localhost:9000/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        first_user_id: user.id,
        second_user_id: second_user.id,
      }),
    });
    console.log(res.status);
    const body = await res.json();
    return body;
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Main user
 * @param {Object} chat - Chat between main user and another user
 * @param {String} body - Text of message
 */
async function debugMessage(user, chat, body) {
  process.stdout.write(
    `Creating message from user ${user.name} in chat ${chat.id}...`,
  );
  try {
    res = await fetch("http://localhost:9000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        sender_id: user.id,
        chat_id: chat.id,
        body: body,
      }),
    });
    console.log(res.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Main user
 * @param {String} name - Name of tournament
 * @param {Array} players - Array of players
 */
async function debugTournament(user, name, players) {
  process.stdout.write(`Creating tournament ${name}...`);
  try {
    const ids = players.map((user) => user.id);
    res = await fetch("http://localhost:9000/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name: name,
        player_amount: ids.length,
        player_ids: ids,
      }),
    });
    console.log(res.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * @param {Object} user - Left player
 * @param {Object} second_user - Right player
 * @param {String} result - Result of the match
 * @param {Object} winner - Winner player
 * @param {Object} loser - Loser player
 */
async function debugMatch(user, second_user, result, winner, loser) {
  process.stdout.write(
    `Creating match between ${user.name} and ${second_user.name}...`,
  );
  try {
    res = await fetch("http://localhost:9000/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        left_player_id: user.id,
        right_player_id: second_user.id,
        result: result,
        winner_id: winner.id,
        loser_id: loser.id,
      }),
    });
    console.log(res.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

(async () => {
  let foo = await debugRegister("foo");
  let bar = await debugRegister("bar");
  let baz = await debugRegister("baz");
  let qud = await debugRegister("qud");
  let qux = await debugRegister("qux");
  let bfoo = await debugRegister("bfoo");
  let bbar = await debugRegister("bbar");

  await debugFriend(foo, bar);
  await debugFriend(foo, baz);
  await debugFriend(foo, qud);
  await debugFriend(foo, qux);
  await debugFriend(bar, baz);
  await debugFriend(bar, qux);

  await debugBlock(foo, bfoo);
  await debugBlock(foo, bbar);

  let foo_bar_chat = await debugChat(foo, bar);
  let bar_baz_chat = await debugChat(bar, baz);

  for (let i = 1; i < 10; i++) {
    await debugMessage(foo, foo_bar_chat, `Test message from foo number ${i}`);
    await debugMessage(bar, foo_bar_chat, `Test message from bar number ${i}`);
    await debugMessage(baz, bar_baz_chat, `Test message from baz number ${i}`);
  }

  await debugTournament(foo, "Test tournament one", [foo, bar, baz, qud]);
  await debugTournament(foo, "Test tournament two", [foo, qux, baz, qud]);

  await debugMatch(foo, bar, "3, 2", foo, bar);
  await debugMatch(foo, bar, "2, 3", bar, foo);
  await debugMatch(foo, bar, "3, 1", foo, bar);
})();
