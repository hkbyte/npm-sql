import Knex from 'knex'
import SqlTransaction from './SqlTransaction'

export function createSqlTransaction(
	dbClient: Knex,
	trx: Knex.Transaction | undefined | null = undefined,
) {
	return new SqlTransaction(dbClient, trx)
}

export { SqlTransaction }
export * from './db'
