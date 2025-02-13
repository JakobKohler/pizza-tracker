const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");

function generateRandomKey() {
  return crypto.randomBytes(16).toString("hex");
}

function hashKey(key) {
  return crypto.createHash("sha384").update(key).digest("hex");
}

function createUser(name) {
  const randomKey = generateRandomKey();
  console.log(`Key for ${name}: ${randomKey}`);

  const hashedKey = hashKey(randomKey);
  db.run(
    `INSERT INTO users (name, api_key) VALUES (?, ?)`,
    [name, hashedKey],
    function (err) {
      if (err) {
        console.error("Error inserting data:", err.message);
      }
    }
  );
}

const db = new sqlite3.Database("../db/pizza_stats.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  }
});

const namesToGen = process.argv.slice(2);

namesToGen.forEach((name) => {
  createUser(name);
});

db.close();
