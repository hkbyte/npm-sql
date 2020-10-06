import Knex from 'knex';
export default class SqlTransaction {
    db: Knex;
    trx?: Knex.Transaction;
    private trxFlag;
    constructor(dbClient: Knex, trx?: Knex.Transaction | undefined | null);
    /**
     * Start Transaction
     */
    start(): Promise<void>;
    /**
     * Commit Transaction
     */
    commit(): void;
    /**
     * Rollback Transaction
     */
    rollback(): void;
    /**
     * Knex Query Parameter
     */
    knex(tableName?: string | Knex.Raw<any> | Knex.QueryBuilder<any, any> | Knex.AliasDict | undefined, transacting?: boolean): Knex.QueryBuilder<any, any>;
    /**
     * Execute Raw SQL Queries
     */
    query(rawQuery: string, bindings: Knex.RawBinding[], transacting?: boolean): Knex.Raw;
}
