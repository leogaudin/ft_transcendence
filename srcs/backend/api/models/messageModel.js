import db from "../database.js";

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
