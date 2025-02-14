const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const endpoints = require("./routes.js");
const sqlite3 = require("sqlite3");
const dbx = require("./utils/dbUtils.js");
const extractAPIKey = require("./utils/apiUtils.js");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(
  express.json({
    strict: true,
    type: "application/json",
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        try {
          JSON.parse(buf.toString());
        } catch (err) {
          throw new SyntaxError("Invalid JSON format");
        }
      }
    },
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next(err);
});

const db = new sqlite3.Database("db/pizza_stats.db", sqlite3.OPEN_READWRITE);

app.get("/rest/api/v1", (req, res) => {
  res.json({
    apiVersion: "1.0",
    endpoints: endpoints,
  });
});

app.get("/rest/api/v1/pizzaStats", async (req, res) => {
  const allPizzaEntries = await dbx.fetchAllPizzaEntries(db);
  res.json(allPizzaEntries);
});

app.get("/api/v1/pizzaStats/:user", async (req, res) => {
  const requestedName = req.params["user"];
  dbx
    .fetchPizzaEntriesByName(db, requestedName)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
});

app.post("/api/v1/pizzaStats", async (req, res) => {
  const apiKey = extractAPIKey(req);

  if (!apiKey) {
    res.status(401).json("Invalid API Key");
  }

  const { name, date, source, variety } = req.body;

  dbx
    .insertPizzaEntry(db, name, date, source, variety, apiKey)
    .then((ok) => {
      res.json("Entry inserted");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.delete("/api/v1/pizzaStats/:id", async (req, res) => {
  const apiKey = extractAPIKey(req);

  if (!apiKey) {
    res.status(401).json("Invalid API Key");
  }

  const idToDelete = req.params["id"];

  dbx
    .deletePizzaEntry(db, idToDelete, apiKey)
    .then((ok) => {
      res.json("Entry deleted");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.listen(port, () => {
  console.log(`Pizza data server listening on Port ${port}`);
});
