const knex = require("knex")

/**
 * Create Database Client Object
 * @param {object} config Database configurations
 * @param {string} config.client The client parameter is required and determines which client adapter will be used with the library eg. pg or mysql2.
 * @param {string} [config.version=] The database version can be added in knex configuration, when you use the PostgreSQL adapter to connect a non-standard database.
 * @param {string} [config.searchPath=] Knex's PostgreSQL client allows you to set the initial search path for each connection automatically
 * @param {*} config.connection The connection options are passed directly to the appropriate database client to create the connection, and may be either an object, a connection string, or a function returning an object
 * @param {object} [config.userParams=] userParams is an optional parameter that allows you to pass arbitrary parameters which will be accessible via db client userParams property
 * @param {Array} [config.fetchAsString=] The valid types are 'DATE', 'NUMBER' and 'CLOB'. When any column having one of the specified types is queried, the column data is returned as a string instead of the default representation
 * @param {*} [config.postProcessResponse=] Hook for modifying returned rows, before passing them forward to user
 * @param {number} [config.acquireConnectionTimeout=60000] used to determine how long should wait before throwing a timeout error when acquiring a connection is not possible
 * @param {object} [config.pool={min:2, max:10}] The client created by the configuration initializes a connection pool, using the tarn.js library.
 * @param {number} [config.pool.min=]
 * @param {number} [config.pool.max=]
 * @param {*} [config.pool.afterCreate=] afterCreate callback (rawDriverConnection, done) is called when the pool aquires a new connection from the database server. done(err, connection) callback must be called for client to be able to decide if the connection is ok or if it should be discarded right away from the pool.
 * @returns {knex} Database client
*/
function create(config) {
    return knex(config)
}

// Exporting
module.exports = {
    create
}