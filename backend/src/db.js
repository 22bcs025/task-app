const Database = require('better-sqlite3');
const db = new Database(process.env.DB_PATH || 'data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
  );
`);

module.exports = db;
