class SqlTransaction {
    constructor(db, trx = null) {
        this.db = db
        this.trx = trx || null
        this.trxFlag = false
    }

    // SqlTransaction Start Method
    async start() {
        if ((!this.trxFlag && !this.trx)) {
            // Initilizing SqlTransaction Provider
            this.trxProvider = this.db.transactionProvider()
            this.trx = await this.trxProvider()
            this.trxFlag = true
        }
    }

    // DB Query Method
    knex(tableName) {
        if (this.trx) {
            return this.db(tableName).transacting(this.trx)
        }

        return this.db(tableName)
    }

    // DB Query Raw Method
    query(sql, params) {
        if (this.trx) {
            return this.db.raw(sql, params).transacting(this.trx)
        }

        return this.db.raw(sql, params)
    }

    // Batch Insert
    batchInsert(tableName, data) {
        if (this.trx) {
            return this.db.batchInsert(tableName, data).transacting(this.trx)
        }

        return this.db.batchInsert(tableName, data)
    }

    // Commit SqlTransaction
    commit() {
        if (this.trxFlag) {
            this.trx.commit()
            this.trxFlag = false
        }
    }

    // Rollback SqlTransaction
    rollback() {
        if (this.trxFlag) {
            this.trx.rollback()
            this.trxFlag = false
        }
    }
}

async function getSqlTransaction(db, trx) {
    return new SqlTransaction(db, trx)
}

module.exports = getSqlTransaction