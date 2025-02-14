#!/bin/sh

echo "Running createUsers.js..."
node utils/createUsers.js mani schasch master

if [ $? -eq 0 ]; then
  echo "Database initialized successfully. Starting the server..."
  node server.js
else
  echo "Error: Failed to initialize the database."
  exit 1
fi
