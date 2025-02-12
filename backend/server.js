const express = require('express')
const app = express()
const port = 3000
const endpoints = require('./routes.js')



app.get('/api/v1', (req, res) => {
    res.json({
        apiVersion: '1.0',
        endpoints: endpoints,
    });
});

app.get("api/v1/pizzaStats", (req, res) => {
    
})

app.listen(port, () => {
  console.log(`Pizza data server listening on Port ${port}`)
})
