import Knex from 'knex'

export function createDatabaseClient(config: Knex.Config): Knex {
    return Knex(config)
}

export { Knex }
