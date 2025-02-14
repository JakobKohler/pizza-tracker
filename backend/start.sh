#!/bin/sh

echo "Running createUsers.js..."
cd utils
node createUsers.js mani schasch master
cd ..
if [ $? -eq 0 ]; then
  echo "Database initialized successfully. Starting the server..."
  node server.js
else
  echo "Error: Failed to initialize the database."
  exit 1
fi
