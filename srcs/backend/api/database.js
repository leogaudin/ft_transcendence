import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("transcendence.db", (err) => {
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
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
    (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      }
      console.log("User table ready.");
    },
  );
});
