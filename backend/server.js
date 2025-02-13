const express = require('express')
const app = express()
const port = 3000
const endpoints = require('./routes.js')
const sqlite3 = require('sqlite3');
const dbx = require('./dbUtils.js')
const bodyParser = require('body-parser')

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 

const db = new sqlite3.Database('db/pizza_stats.db', sqlite3.OPEN_READWRITE);

app.get('/api/v1', (req, res) => {
    res.json({
        apiVersion: '1.0',
        endpoints: endpoints,
    });
});

app.get("/api/v1/pizzaStats", async(req, res) => {
    const allPizzaEntries = await dbx.fetchAllPizzaEntries(db);
    res.json(allPizzaEntries);

})

app.get("/api/v1/pizzaStats/:user", async(req, res) => {
    const requestedName = req.params["user"];
    const pizzaEntries = dbx.fetchPizzaEntriesByName(db, requestedName)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            return res.json(err)
        });

})

app.post("/api/v1/pizzaStats", async(req, res) => {
    const { name, date, type } = req.body;

    dbx.insertPizzaEntry(db, name, date, type)
        .then(ok => {
            res.json("Entry inserted")
        })
        .catch(err => {
            res.status(400).json(err)
        });

})

app.listen(port, () => {
  console.log(`Pizza data server listening on Port ${port}`)
})


