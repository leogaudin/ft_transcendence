import sqlite3 from "sqlite3";

const db = new sqlite3.Database("transcendence.db", (err) => {
  if (err) {
    return console.error("Error opening the database:", err.message);
  }
  console.log("Connected to the SQLite3 database.");
});

// Users
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    alias TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT 0,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    wins INTEGER DEFAULT 0 CHECK (wins >= 0),
    losses INTEGER DEFAULT 0 CHECK (losses >= 0)
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("User table ready.");
    },
  );
  db.run(
    `
    CREATE TABLE IF NOT EXISTS user_friends (
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    UNIQUE (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Friend table ready.");
    },
  );
});

// Tournaments
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    player_amount INTEGER DEFAULT 4 CHECK (player_amount >= 4)
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Tournament table ready.");
    },
  );
  db.run(
    `
    CREATE TABLE IF NOT EXISTS tournaments_players (
    tournament_id INTEGER,
    player_id INTEGER,
    PRIMARY KEY (tournament_id, player_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Tournament players table ready.");
    },
  );
});

// Matches
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    left_player_id INTEGER,
    right_player_id INTEGER,
    result TEXT,
    winner_id INTEGER,
    loser_id INTEGER,
    tournament_id INTEGER,
    FOREIGN KEY (left_player_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (right_player_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (loser_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Match table ready.");
    },
  );
});

// Chats
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_user_id INTEGER,
    second_user_id INTEGER,
    FOREIGN KEY (first_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (second_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(first_user_id, second_user_id)
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Chat table ready.");
    },
  );
});

// Messages
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    chat_id INTEGER,
    body TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("Message table ready.");
    },
  );
});

export default db;
