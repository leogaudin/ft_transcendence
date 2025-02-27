import db from "../database.js";

/**
 * Finds all avaliable messages
 * @returns {Array} - All avaliable messages
 */
export function getMessages() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM messages";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting messages:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 * Creates a message
 * @param {Object} data - IDs of the sender, chat and body of the message
 * @returns {Object} - Newly created message
 */
export function createMessage(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO messages (sender_id, chat_id, body) VALUES (?,?,?)`;
    const params = [data.sender_id, data.chat_id, data.body];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting message:", err.message);
        return reject(err);
      }
      resolve({
        id: this.lastID,
        sender_id: data.sender_id,
        chat_id: data.chat_id,
        body: data.body,
      });
    });
  });
}

/**
 * Finds a message by a given ID
 * @param {Number} id - ID of the message
 * @returns {Object} - Found message
 */
export function getMessageByID(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM messages WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting message:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

/**
 * Fully modifies a message
 * @param {Number} id - ID of the message
 * @param {Object} data - IDs of the sender, chat and body of the message
 * @returns {Object} - Modified message
 */
export function putMessage(id, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE messages
      SET sender_id = ?, chat_id = ?, body = ?
      WHERE id = ?
    `;
    const params = [data.sender_id, data.chat_id, data.body, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating message:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Message not found"));
      }
      resolve(getMessageByID(id));
    });
  });
}

/**
 * Modifies one or more fields of a message
 * @param {Number} id - ID of the message
 * @param {Object} updates - Field(s) to modify
 * @returns {Object} - Modified fields
 */
export function patchMessage(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const params = Object.values(updates);
    params.push(id);
    const sql = `
      UPDATE messages
      SET ${fields}
      WHERE id = ?
    `;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating message:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Message not found"));
      }
      resolve({ id, ...updates });
    });
  });
}
/**
 * Deletes a message by a given ID
 * @param {Number} id - ID of the message
 * @returns {Promise} - Nothing on success,
 *                      error on failure
 */
export function deleteMessage(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM messages
      WHERE id = ?
    `;
    db.run(sql, id, function (err) {
      if (err) {
        console.error("Error deleting message:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Message not found"));
      }
      resolve();
    });
  });
}

/**
 * Finds all messages of a given user
 * @param {Number} id - ID of the user
 * @returns {Array} - All found messages
 */
export function getMessagesOfUser(id) {
  return new Promise((resolve, reject) => {
    const sql = ` SELECT * FROM messages WHERE sender_id = ? `;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error("Error getting messagess:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}
