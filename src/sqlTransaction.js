const Knex = require("knex")

/**
 * Create new SQL Transactiom Client
 * @class
 * @returns {*} DB Client 
 */
class SqlTransaction {
    constructor(db, trx = null) {
        this.db = db
        this.trx = trx || null
        this.trxFlag = false
    }

    /**
     * Starts sql transaction
     * @returns {Promise}
     */
    async start() {
        if ((!this.trxFlag && !this.trx)) {
            // Initilizing SqlTransaction Provider
            this.trxProvider = this.db.transactionProvider()
            this.trx = await this.trxProvider()
            this.trxFlag = true
        }
    }

    /**
     * Knex query builder
     * @param {*} [table=] table name
     * @returns {Knex} Knex query builder
     */
    knex(table = null) {
        const dbObject = table ? this.db(table) : this.db

        if (this.trx) {
            return dbObject.transacting(this.trx)
        }

        return dbObject
    }

    /**
     * Execute raw query
     * @param {string} sql SQL query
     * @param {Array} params Query bindings
     */
    query(sql, params) {
        if (this.trx) {
            return this.db.raw(sql, params).transacting(this.trx)
        }

        return this.db.raw(sql, params)
    }

    /**
    * Commits sql transaction
    */
    commit() {
        if (this.trxFlag) {
            this.trx.commit()
            this.trxFlag = false
        }
    }

    /**
    * Rollback sql transaction
    */
    rollback() {
        if (this.trxFlag) {
            this.trx.rollback()
            this.trxFlag = false
        }
    }
}

/**
 * Get sql transaction client
 * @param {Knex} db DB Client
 * @param {SqlTransaction.trx} [trx=] SQL Transaction
 * @returns {SqlTransaction} SQL transaction client
 */
async function getSqlTransaction(db, trx) {
    return new SqlTransaction(db, trx)
}

// Exporting
module.exports = getSqlTransaction