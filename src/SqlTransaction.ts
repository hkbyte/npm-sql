import Knex, { QueryBuilder } from 'knex'

export default class SqlTransaction {
    db: Knex
    trx?: Knex.Transaction
    private trxFlag: boolean

    constructor(
        dbClient: Knex,
        trx: Knex.Transaction | undefined | null = undefined,
    ) {
        this.db = dbClient
        this.trx = trx || undefined
        this.trxFlag = false
    }

    /**
     * Start Transaction
     */
    async start(): Promise<void> {
        if (!this.trxFlag && !this.trx) {
            const trxProvider = this.db.transactionProvider()
            this.trx = await trxProvider()
            this.trxFlag = true
        }
    }

    /**
     * Commit Transaction
     */
    commit(): void {
        if (this.trxFlag && this.trx) {
            this.trx.commit()
            this.trxFlag = false
        }
    }

    /**
     * Rollback Transaction
     */
    rollback(): void {
        if (this.trxFlag && this.trx) {
            this.trx.rollback()
            this.trxFlag = false
        }
    }

    /**
     * Knex Query Parameter
     */
    knex(
        tableName:
            | string
            | Knex.Raw<any>
            | Knex.QueryBuilder<any, any>
            | Knex.AliasDict
            | undefined = undefined,
        transacting: boolean = true,
    ) {
        const knexObject: QueryBuilder = tableName
            ? this.db(tableName)
            : this.db.queryBuilder()

        if (this.trx && transacting) {
            return knexObject.transacting(this.trx)
        }

        return knexObject
    }

    /**
     * Execute Raw SQL Queries
     */
    query(
        rawQuery: string,
        bindings: Knex.RawBinding[],
        transacting: boolean = true,
    ): Knex.Raw {
        const knexObject = this.db.raw(rawQuery, bindings)

        if (this.trx && transacting) {
            return knexObject.transacting(this.trx)
        }
        return knexObject
    }
}
