import db from "../database.js";

/**
 * Finds all avaliable chats
 * @returns {Array} - All avaliable rows
 */
export function getChats() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM chats";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting chats:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 * Creates a chat between two users,
 * ensuring uniqueness by ordering the IDs
 * @param {Object} data - IDs of the users
 * @returns {Object} - Newly created chat
 */
export function createChat(data) {
  return new Promise((resolve, reject) => {
    // Ensuring unique chats between two people
    const first_id = Math.min(data.first_user_id, data.second_user_id);
    const second_id = Math.max(data.first_user_id, data.second_user_id);

    const sql = `INSERT INTO chats (first_user_id, second_user_id) VALUES (?,?)`;
    const params = [first_id, second_id];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting chat:", err.message);
        return reject(err);
      }
      resolve({
        id: this.lastID,
        first_user_id: first_id,
        second_user_id: second_id,
      });
    });
  });
}

/**
 * Finds a chat by a given ID if it exists
 * @param {Number} id - ID of the chat
 * @returns {Object} - Found chat
 */
export function getChatByID(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        m.id AS message_id,
        m.sender_id,
        m.receiver_id,
        m.body,
        m.sent_at,
        s.username AS sender_username,
        r.username AS receiver_username
      FROM
        messages m
      JOIN
        users s ON m.sender_id = s.id
      JOIN
        users r ON m.receiver_id = r.id
      WHERE
        m.chat_id = ?
      ORDER BY
        m.sent_at ASC`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error("Error getting chat:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 * Fully replaces a chat
 * @param {Number} id - ID of the chat
 * @param {Object} data - Data to replace with
 * @returns {Object} - Modified chat
 */
export function putChat(id, data) {
  return new Promise((resolve, reject) => {
    const first_id = Math.min(data.first_user_id, data.second_user_id);
    const second_id = Math.max(data.first_user_id, data.second_user_id);
    const sql = `
      UPDATE chats
      SET first_user_id = ?, second_user_id = ?
      WHERE id = ?
    `;
    const params = [first_id, second_id, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating chat:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Chat not found"));
      }
      resolve(getChatByID(id));
    });
  });
}

/**
 * Modifies one or more fields of a chat
 * @param {Number} id - ID of the chat
 * @param {Object} updates - Field(s) to modify
 * @returns {Object} - Modified fields
 */
export function patchChat(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const params = Object.values(updates);
    params.push(id);
    const sql = `
      UPDATE chats
      SET ${fields}
      WHERE id = ?
    `;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating chat:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Chat not found"));
      }
      resolve({ id, ...updates });
    });
  });
}

/**
 * Deletes a chat
 * @param {Number} id - ID of the chat
 * @returns {Promise} - Nothing on success,
 *                      error on failure
 */
export function deleteChat(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM chats
      WHERE id = ?
    `;
    db.run(sql, id, function (err) {
      if (err) {
        console.error("Error deleting chat:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Chat not found"));
      }
      resolve();
    });
  });
}

/**
 * Returns all found chats of a user
 * @param {Number} id - ID of the user
 * @returns {Array} - All found chats
 */
export function getChatsOfUser(id) {
  return new Promise((resolve, reject) => {
    const sql = ` SELECT * FROM chats WHERE first_user_id = ? OR second_user_id = ?`;
    db.all(sql, [id, id], (err, rows) => {
      if (err) {
        console.error("Error getting chats:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 * Gets all chats of user and the last message of them
 * @param {Number} id - ID of the user
 * @returns {Object} - All chats with the last message,
 *                     sorted by date
 */
export function getLastChatsOfUser(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      WITH RankedMessages AS (
      SELECT
        c.id AS chat_id,
        sender.username AS sender_username,
        sender.is_deleted AS sender_deleted,
        m.body,
        m.sent_at,
        ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY m.sent_at DESC) AS message_rank
        FROM chats c
        JOIN users first_user ON c.first_user_id = first_user.id
        JOIN users second_user ON c.second_user_id = second_user.id
        JOIN messages m ON c.id = m.chat_id
        JOIN users sender ON m.sender_id = sender.id
        JOIN users receiver ON m.receiver_id = receiver.id
        WHERE c.first_user_id = ? OR c.second_user_id = ?
      )
      SELECT *
      FROM RankedMessages
      WHERE message_rank = 1
      ORDER BY sent_at DESC `;
    db.all(sql, [id, id], (err, rows) => {
      if (err) {
        console.error("Error getting chats:", err.message);
        return reject(err);
      }
      rows.forEach((row) => {
        row.sender_username = row.sender_deleted
          ? "anonymous"
          : row.sender_username;
        delete row.message_rank;
        delete row.sender_deleted;
      });
      resolve(rows);
    });
  });
}
