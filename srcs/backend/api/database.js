import sqlite3 from "sqlite3";

const db = new sqlite3.Database("transcendence.db", (err) => {
  if (err) {
    return console.error("Error opening the database:", err.message);
  }
  console.log("Connected to the SQLite3 database.");
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    alias TEXT NOT NULL,
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
    `CREATE TABLE IF NOT EXISTS user_fiends(
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
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

export default db;
