#!/bin/bash

DB_NAME="pizza_stats.db"

sqlite3 $DB_NAME <<EOF
CREATE TABLE pizza_stats (
    name TEXT,
    date TEXT,
    type TEXT
);
EOF