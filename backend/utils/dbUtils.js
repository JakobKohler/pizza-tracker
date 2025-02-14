const crypto = require("crypto");

async function fetchAllPizzaEntries(db) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM pizza_stats";
    db.all(query, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

async function fetchPizzaEntriesByName(db, name) {
  try {
    const isValid = await checkName(db, name);
    if (!isValid) {
      return Promise.reject("Invalid name");
    }

    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM pizza_stats WHERE name = ?";
      db.all(query, [name], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function insertPizzaEntry(db, name, date, source, variety, apiKey) {
  try {
    const isValidName = await checkName(db, name);

    if (!isValidName) {
      return Promise.reject("Invalid name");
    }

    const isValidKey = await checkAPIKey(db, apiKey, name);
    if (!isValidKey) {
      return Promise.reject("Invalid key");
    }

    if (
      !date ||
      typeof date !== "string" ||
      !source ||
      typeof source !== "string" ||
      !variety ||
      typeof variety !== "string"
    ) {
      return Promise.reject("Invalid pizza entry properties");
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return Promise.reject("Invalid date format");
    }

    return performInsertPizzaEntry(db, name, date, source, variety);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function performInsertPizzaEntry(db, name, date, source, variety) {
  return new Promise((resolve, reject) => {
    const pizzaEntryInsertionSql = `INSERT INTO pizza_stats(name, date, source, variety) VALUES(?, ?, ?, ?)`;
    db.run(
      pizzaEntryInsertionSql,
      [name, date, source, variety],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
}

async function deletePizzaEntry(db, id, apiKey) {
  const apiKeyExists = await checkAPIKey(db, apiKey);

  if (!apiKeyExists) {
    return Promise.reject("Invalid key");
  }

  const nameToId = await getNameToEntryID(db, id);

  if (!nameToId) {
    return Promise.reject("Invalid entry id");
  }

  const isValidAPIKey = await checkAPIKey(db, apiKey, nameToId);

  if (!isValidAPIKey) {
    return Promise.reject("Invalid key");
  }

  return new Promise((resolve, reject) => {
    const pizzaEntryDeletionSql = `DELETE FROM pizza_stats WHERE id = ?`;
    db.run(pizzaEntryDeletionSql, [id], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

async function checkName(db, name) {
  return new Promise((resolve, reject) => {
    const namesQuery = "SELECT DISTINCT name FROM users";
    db.all(namesQuery, [], (err, rows) => {
      if (err) {
        reject(false);
      }
      const validNames = new Set(rows.map((row) => row.name));

      if (!validNames.has(name)) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

async function checkAPIKey(db, key, name = "") {
  const hashedKey = hashKey(key);
  return new Promise((resolve, reject) => {
    let namesQuery;
    const queryParams = [];

    if (name) {
      namesQuery =
        'SELECT api_key FROM users WHERE name = ? OR name = "master"';
      queryParams.push(name.toLowerCase());
    } else {
      namesQuery = "SELECT api_key FROM users";
    }

    db.all(namesQuery, queryParams, (err, rows) => {
      if (err) {
        return reject(false);
      }
      const nameKeys = rows.map((row) => row.api_key);

      if (nameKeys.includes(hashedKey)) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
}

async function getNameToEntryID(db, id) {
  return new Promise((resolve, reject) => {
    const namesQuery = "SELECT name FROM pizza_stats WHERE id = ?";
    db.get(namesQuery, [id], (err, row) => {
      if (err) {
        reject(false);
      }
      if (!row) {
        resolve(false);
      } else {
        resolve(row.name);
      }
    });
  });
}

function hashKey(key) {
  return crypto.createHash("sha384").update(key).digest("hex");
}

module.exports = {
  fetchAllPizzaEntries,
  fetchPizzaEntriesByName,
  insertPizzaEntry,
  deletePizzaEntry,
};
