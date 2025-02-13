
async function fetchAllPizzaEntries(db) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM pizza_stats'
            db.all(query, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
        });
    });
};

async function fetchPizzaEntriesByName(db, name) {
    return new Promise((resolve, reject) => {
        if(!checkName(db, name)) return reject('Invalid name');

        const query = 'SELECT * FROM pizza_stats WHERE name = ?';
            db.all(query, [name], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
}

async function insertPizzaEntry(db, name, date, type) {
    return new Promise((resolve, reject) => {

        if(!checkName(db, name)) return reject('Invalid name');

        if (!date || typeof date !== 'string' || !type || typeof type !== 'string') {
            return reject('Invalid pizza entry properties');
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return reject('Invalid date format');
        }

        const pizzaEntryInsertionSql = `INSERT INTO pizza_stats(name, date, type) VALUES(?, ?, ?)`;
            db.run(pizzaEntryInsertionSql, [name, date, type], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
        });
    });
};

async function checkName(db, name) {
    return new Promise((resolve, reject) => {
        const namesQuery = 'SELECT DISTINCT name FROM pizza_stats';
                db.all(namesQuery, [], (err, rows) => {
                    if (err) {
                        return reject(false);
                    }
        
                    const validNames = new Set(rows.map(row => row.name));
        
                    if (!validNames.has(name)) {
                        return reject(false);
                    }
                resolve(true);
        });
    });
};

module.exports = {
    fetchAllPizzaEntries,
    fetchPizzaEntriesByName,
    checkName,
    insertPizzaEntry
};

