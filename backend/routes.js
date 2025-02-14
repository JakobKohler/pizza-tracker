const endpoints = {
    'GET /api/v1': 'API root',
    'GET /api/v1/pizzaStats': 'Get pizza data of all users',
    'GET /api/v1/pizzaStats/:user': 'Get pizza data for a specific user',
    'POST /api/v1/pizzaStats': 'Add a new entry to the pizza DB. Needs sufficient API Key',
    'DELETE /api/v1/pizzaStats/:id': 'Delete an entry specified by the given ID. Needs sufficient API Key',
};

module.exports = endpoints;
