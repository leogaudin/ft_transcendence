import db from "../database.js";

export function getMatches() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM matches";

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Error getting match:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}
