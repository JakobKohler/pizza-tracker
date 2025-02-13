#!/bin/bash

DB_NAME="pizza_stats.db"

sqlite3 $DB_NAME <<EOF
CREATE TABLE pizza_stats (
    name TEXT,
    date TEXT,
    type TEXT
);
EOF

sqlite3 $DB_NAME <<EOF
CREATE TABLE users (
    name TEXT PRIMARY KEY,
    api_key TEXT NOT NULL
);
EOF
