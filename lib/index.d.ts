import Knex from 'knex';
import SqlTransaction from './SqlTransaction';
export declare function createSqlTransaction(dbClient: Knex, trx?: Knex.Transaction | undefined | null): SqlTransaction;
export { SqlTransaction };
export * from './db';
