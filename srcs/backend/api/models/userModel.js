import bcrypt from "bcryptjs";
import db from "../database.js";
import { anonymize } from "../utils.js";

export function getUsers() {
  return new Promise((resolve, reject) => {
    const sql = ` SELECT u.id, u.username, u.email, u.is_deleted FROM users u `;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting users:", err.message);
        return reject(err);
      }
      rows.forEach(anonymize);
      resolve(rows);
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
    const sql = `
      SELECT u.*,
      GROUP_CONCAT(uf.friend_id) AS friends_ids
      FROM users u
      LEFT JOIN user_friends uf ON u.id = uf.user_id
      WHERE id = ?
      GROUP BY u.id`;

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting user:", err.message);
        return reject(err);
      }
      if (!row) return reject({ message: "user not found" });
      const user = {
        ...row,
        friends: row.friends_ids ? row.friends_ids.split(",").map(Number) : [],
      };
      delete user.friends_ids;
      delete user.password;
      anonymize(user);
      resolve(user);
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
      UPDATE users
      SET is_deleted = 1
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

export function addUserFriend(id, friend_id) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO user_friends (user_id, friend_id)
      VALUES (?,?), (?,?)`;
    const params = [id, friend_id, friend_id, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user friends:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve({ user_id: id, friend_id: friend_id });
    });
  });
}
export function removeUserFriend(id, friend_id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM user_friends
      WHERE (user_id = ? AND friend_id = ?)
      OR (user_id = ? AND friend_id = ?)`;
    const params = [id, friend_id, friend_id, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user friends:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve({ success: "friend removed" });
    });
  });
}

export function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM users
      WHERE username = ? AND is_deleted = 0 `;
    db.get(sql, username, function (err, row) {
      if (err) {
        console.error("Error getting user:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM users
      WHERE email = ? AND is_deleted = 0 `;
    db.get(sql, email, function (err, row) {
      if (err) {
        console.error("Error getting user:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}
