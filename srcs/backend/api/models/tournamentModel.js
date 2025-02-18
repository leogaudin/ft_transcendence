import db from "../database.js";

export function getPlayersInTournament(tournamentID) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT player_id FROM tournament_players WHERE tournament_id = ?";

    db.all(sql, tournamentID, (err, rows) => {
      if (err) {
        console.error("Error getting tournament players:", err.message);
        return reject(err);
      }
      resolve(rows.map((row) => row.player_id));
    });
  });
}

export function getTournaments() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        t.id,
        t.name,
        t.player_amount,
        GROUP_CONCAT(tp.player_id) as player_ids
      FROM tournaments t
      LEFT JOIN tournament_players tp ON t.id = tp.tournament_id
      GROUP BY t.id, t.name, t.player_amount
    `;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting tournaments:", err.message);
        return reject(err);
      }
      const tournaments = rows.map((row) => ({
        ...row,
        player_ids: row.player_ids
          ? row.player_ids.split(",").map((id) => parseInt(id))
          : [],
      }));
      resolve(tournaments);
    });
  });
}

export function addPlayerToTournament(tournamentID, playerId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournament_players (tournament_id, player_id) VALUES (?,?)`;
    const params = [tournamentID, playerId];
    db.run(sql, params, (err) => {
      if (err) {
        console.error("Error adding player to tournament:", err.message);
        return reject(err);
      }
      resolve();
    });
  });
}

export function createTournament(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournaments (name, player_amount) VALUES (?,?)`;
    const params = [data.name, data.player_amount];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting tournament:", err.message);
        return reject(err);
      }
      const tournamentID = this.lastID;
      const insertPromises = data.player_ids.map((playerID) =>
        addPlayerToTournament(tournamentID, playerID),
      );
      Promise.all(insertPromises)
        .then(() =>
          resolve({
            id: tournamentID,
            name: data.name,
            player_amount: data.player_amount,
            player_ids: data.player_ids,
          }),
        )
        .catch(reject);
    });
  });
}

export function getTournamentByID(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.id, t.name, t.player_amount,
      GROUP_CONCAT(tp.player_id) as player_ids
      FROM tournaments t
      LEFT JOIN tournament_players tp ON t.id = tp.tournament_id
      WHERE t.id = ?
      GROUP BY t.id, t.name, t.player_amount
      `;

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error getting tournament:", err.message);
        return reject(err);
      }
      if (row && row.player_ids) {
        row.player_ids = row.player_ids.split(",").map((id) => parseInt(id));
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

export function getTournamentsOfUser(id) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.* FROM tournaments t 
      JOIN tournament_players tp ON t.id = tp.tournament_id
      WHERE tp.player_id = ?`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error("Error getting matches:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}
