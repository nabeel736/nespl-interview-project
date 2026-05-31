const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'shiptrack.db');

const db = new DatabaseSync(DB_PATH);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT UNIQUE NOT NULL,
    item_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    current_status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (tracking_id) REFERENCES shipments(tracking_id)
  );
`);

module.exports = db;
