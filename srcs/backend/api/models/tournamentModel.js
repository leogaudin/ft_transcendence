import db from "../database.js";

export function getTournaments() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tournaments";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting tournaments:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

export function createTournament(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournaments (name, player_amount, player_ids) VALUES (?,?,?)`;
    const params = [data.name, data.player_amount, data.player_ids];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting tournament:", err.message);
        return reject(err);
      }
      resolve({
        id: this.lastID,
        name: data.name,
        player_amount: data.player_amount,
        player_ids: data.player_ids,
      });
    });
  });
}

export function getTournamentByID(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tournaments WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting tournament:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

export function putTournament(id, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE tournaments
      SET name = ?, player_amount = ?, player_ids = ?
      WHERE id = ?
    `;
    const params = [data.name, data.player_amount, data.player_ids, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating tournament:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Tournament not found"));
      }
      resolve(getTournamentByID(id));
    });
  });
}

export function patchTournament(updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const params = Object.values(updates);
    params.push(id);
    const sql = `
      UPDATE tournaments
      SET ${fields}
      WHERE id = ?
    `;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating tournament:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Tournament not found"));
      }
      resolve({ id, ...updates });
    });
  });
}

export function deleteTournament(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM tournaments
      WHERE id = ?
    `;
    db.run(sql, id, function (err) {
      if (err) {
        console.error("Error deleting tournament:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Tournament not found"));
      }
      resolve();
    });
  });
}
