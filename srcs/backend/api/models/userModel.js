import bcrypt from "bcryptjs";
import db from "../database.js";
import { anonymize } from "../utils.js";

/**
 * Returns the ID, username and email of all avaliable users
 * @returns {array} - All avaliable users
 */
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

/**
 * Creates a user, hashing the password in the process
 * @param {payload} data - User to create
 * @returns {object} - The newly created user
 */
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

/**
 * Finds a user by a given ID if it exists
 * @param {int} id - ID of the user
 * @returns {object} - The found user
 */
export function getUserByID(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.*,
      GROUP_CONCAT(DISTINCT uf.friend_id) AS friends_ids,
      GROUP_CONCAT(DISTINCT ub.blocked_id) AS blocked_ids
      FROM users u
      LEFT JOIN user_friends uf ON u.id = uf.user_id
      LEFT JOIN user_blocks ub ON u.id = ub.user_id
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
        blocks: row.blocked_ids ? row.blocked_ids.split(",").map(Number) : [],
      };
      delete user.friends_ids;
      delete user.blocked_ids;
      delete user.password;
      anonymize(user);
      resolve(user);
    });
  });
}

/**
 * Fully modifies a user
 * @param {int} id - ID of the user
 * @param {payload} data - User data to modify
 * @returns {object} - The modified user
 */
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

/**
 * Patches a user with the given information
 * @param {int} id - ID of the user
 * @param {payload} updates - Fields to change
 * @returns {object} - Modified fields
 */
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

/**
 * Sets the deletion flag of a user to true
 * @param {int} id - ID of the user
 * @returns {promise} - Nothing on success,
 *                      error on failure
 */
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

/**
 * Adds a friend to a user
 * @param {int} id - ID of the user
 * @param {int} friend_id - ID of the friend
 * @returns {object} - Object with the IDs of the users
 */
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
/**
 * Deletes a friend for a user
 * @param {int} id - ID of the user
 * @param {int} friend_id - ID of the friend
 * @returns {object} - Object on success,
 *                     error on failure
 */
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

/**
 * Adds a user to the blocked list of another
 * @param {int} id - ID of the user
 * @param {int} blocked_id - ID of the blocked user
 * @returns {object} - IDs of the relevant users
 */
export function addUserBlock(id, blocked_id) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO user_blocks (user_id, blocked_id)
      VALUES (?,?)`;
    const params = [id, blocked_id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user blocks:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve({ user_id: id, blocked_id: blocked_id });
    });
  });
}

/**
 * Removes a user from the blocked list of another
 * @param {int} id - ID of the user
 * @param {int} blocked_id - ID of the blocked user
 * @returns {promise} - Nothing on success,
 *                      error on failure
 */
export function removeUserBlock(id, blocked_id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM user_blocks
      WHERE (user_id = ? AND blocked_id = ?)`;
    const params = [id, blocked_id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating user blocks:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("User not found"));
      }
      resolve({ success: "block removed" });
    });
  });
}

/**
 * Finds a user by a given username
 * @param {string} username - Name of the user
 * @returns {object} - Found user
 */
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

/**
 * Finds a user by a given email
 * @param {string} email - Email of the user
 * @returns {object} - Found user
 */
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
