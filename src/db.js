const knex = require("knex")

function create(config) {
    return knex(config)
}

// Exporting
module.exports = {
    create
}