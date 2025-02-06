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

// TODO: Tournament table
// CHECK DOWNWARDS
//
export function createTournament(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournaments (name, player_amount, players) VALUES (?,?,?)`;
    const params = [data.tournamentname, data.email, data.password];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting tournament:", err.message);
        return reject(err);
      }
      resolve({
        id: this.lastID,
        tournamentname: data.tournamentname,
        email: data.email,
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
      SET tournamentname = ?, email = ?, password = ?
      WHERE id = ?
    `;
    const params = [data.tournamentname, data.email, data.password, id];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating tournamen:", err.message);
        return reject(err);
      }
      if (this.changes === 0) {
        return reject(new Error("Tournament not found"));
      }
      resolve(getTournamentByID(id));
    });
  });
}

export function patchTournamen(updates) {
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
