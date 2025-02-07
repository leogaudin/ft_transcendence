import bcrypt from "bcryptjs";
import db from "../database.js";

export function getUsers() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting users:", err.message);
        return reject(err);
      }
      const passwordRemoved = rows.map(({ password, ...user }) => user);
      resolve(passwordRemoved);
    });
  });
}

export async function createUser(data) {
  data.password = await bcrypt.hash(data.password, 10);
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
    const params = [data.username, data.email, data.password];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting user:", err.message);
        return reject(err);
      }
      resolve({ id: this.lastID, username: data.username, email: data.email });
    });
  });
}

export function getUserByID(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting user:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

export async function putUser(id, data) {
  data.password = await bcrypt.hash(data.password, 10);
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users
      SET username = ?, email = ?, password = ?
      WHERE id = ?
    `;
    const params = [data.username, data.email, data.password, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve(getUserByID(id));
    });
  });
}

export async function patchUser(id, updates) {
  if (updates.hasOwnProperty("password")) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const params = Object.values(updates);
    params.push(id);
    const sql = `
      UPDATE users
      SET ${fields}
      WHERE id = ?
    `;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve({ id, ...updates });
    });
  });
}

export function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM users
      WHERE id = ?
    `;
    db.run(sql, id, function (err) {
      if (err) {
        console.error("Error deleting user:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve();
    });
  });
}

export function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ? `;
    db.get(sql, username, (err, row) => {
      if (err) {
        console.error("Error getting user:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}
