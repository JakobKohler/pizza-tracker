#!/bin/bash

DB_NAME="pizza_stats.db"

sqlite3 $DB_NAME <<EOF
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    api_key TEXT NOT NULL
);

CREATE TABLE pizza_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT,
    source TEXT,
    variety TEXT,
    FOREIGN KEY (name) REFERENCES users(name)
);
EOF
