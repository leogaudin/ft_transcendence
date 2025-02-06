import db from "../database.js";

export function getMatchs() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM matches";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting matches:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

export function createMatch(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO matches (
    left_player_id, right_player_id, result, winner_id, loser_id)
    VALUES (?,?,?,?,?)`;
    const params = [
      data.left_player_id,
      data.right_player_id,
      data.result,
      data.winner_id,
      data.loser_id,
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting match:", err.message);
        return reject(err);
      }
      resolve({
        id: this.lastID,
        left_player_id: data.left_player_id,
        right_player_id: data.right_player_id,
        result: data.result,
        winner_id: data.winner_id,
        loser_id: data.loser_id,
      });
    });
  });
}

export function getMatchByID(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM matches WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting match:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

export function putMatch(id, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE matches
      SET left_player_id = ?, right_player_id = ?, result = ?, winner_id = ?, loser_id = ?
      WHERE id = ?
    `;
    const params = [
      data.left_player_id,
      data.right_player_id,
      data.result,
      data.winner_id,
      data.loser_id,
      id,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating match:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Match not found"));
      }
      resolve(getMatchByID(id));
    });
  });
}

export function patchMatch(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const params = Object.values(updates);
    params.push(id);
    const sql = `
      UPDATE matches
      SET ${fields}
      WHERE id = ?
    `;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating match:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Match not found"));
      }
      resolve({ id, ...updates });
    });
  });
}
export function deleteMatch(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM matches
      WHERE id = ?
    `;
    db.run(sql, id, function (err) {
      if (err) {
        console.error("Error deleting match:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Match not found"));
      }
      resolve();
    });
  });
}
