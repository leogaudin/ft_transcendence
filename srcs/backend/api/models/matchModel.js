import db from "../database.js";
import assert from "node:assert/strict";

/**
 * Creates a match
 * @param {Object} data - IDs and result of the match
 * @returns {Object} - Newly created match
 */
export function createMatch(data) {
  assert(data !== undefined, "data must exist");
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO matches (
        game_type,
        first_player_id,
        second_player_id
      )
      VALUES (?,?,?)
    `;
    const params = [
      data.game_type,
      data.first_player_id,
      data.second_player_id,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting match:", err.message);
        return reject(err);
      }
      resolve({
        match_id: this.lastID,
        game_type: data.game_type,
        first_player_id: data.first_player_id,
        second_player_id: data.second_player_id,
      });
    });
  });
}

/**
 * Schedules a match
 * @param {Object} data - Payload
 * @returns {Object} - Newly scheduled match
 */
export function scheduleMatch(data) {
  assert(data !== undefined, "data must exist");
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO matches (
        game_type,
        first_player_id,
        second_player_id,
        tournament_id,
        phase
      )
      VALUES (?,?,?,?,?)
    `;
    const params = [
      data.game_type,
      data.first_player_id,
      data.second_player_id,
      data.tournament_id,
      data.phase,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting match:", err.message);
        return reject(err);
      }
      resolve({
        match_id: this.lastID,
        game_type: data.game_type,
        first_player_id: data.first_player_id,
        second_player_id: data.second_player_id,
        tournament_id: data.tournament_id,
        phase: data.phase,
      });
    });
  });
}

/**
 * Returns a match by a given ID
 * @param {Number} match_id - ID of the match
 * @returns {Object} - Found match
 */
export function getMatch(match_id) {
  assert(match_id !== undefined, "match_id must exist");
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        matches
      WHERE
        id = ?
    `;
    db.get(sql, [match_id], function (err, row) {
      if (err) {
        console.error("Error getting match:", err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

/**
 * Finishes a match
 * @param {Object} match - Given match
 * @param {Number} first_player_score - Score of the first player
 * @param {Number} second_player_score - Score of the second player
 * @returns {Object} - Success message
 */
export function finishMatch(match, first_player_score, second_player_score) {
  assert(match !== undefined, "match must exist");
  assert(first_player_score !== undefined, "first_player_score must exist");
  assert(second_player_score !== undefined, "second_player_score must exist");
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE
        matches
      SET
        first_player_score = ?,
        second_player_score = ?,
        winner_id = ?,
        loser_id = ?,
        status = 'finished',
        played_at = datetime('now', '+2 hours')
      WHERE
        id = ?
    `;
    const winner_id =
      first_player_score > second_player_score
        ? match.first_player_id
        : match.second_player_id;
    const loser_id =
      first_player_score < second_player_score
        ? match.first_player_id
        : match.second_player_id;
    const params = [
      first_player_score,
      second_player_score,
      winner_id,
      loser_id,
      match.id,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating match:", err.message);
        return reject(err);
      }
      resolve({ success: "Match successfully finished" });
    });
  });
}
