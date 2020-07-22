# @hkbyte/sql

> **A transaction oriented SQL library for Node.js**

Library has easy to use promise based transactions which can be shared with multiple function so no need for nested promises now. It also support multi-dialect query building with knex. Currently **PostgreSQL** and **MySQL** databases are supported. This library uses [pg](https://preview.npmjs.com/package/pg "pg") for PostgreSQL and [mysql2](https://preview.npmjs.com/package/mysql2 "mysql2") for MySQL. Library is only possible with code borrowed from [knex](https://www.npmjs.com/package/knex "Knex"). Node.js versions 10+ are supported.

**Features :**
* SQL Transaction
* Sharable Transaction
* Query building with knex

<br>

### **Creating Database Client :**<br>
Below code will create knex client which will be further used in executing and building SQL queries as well as creating sharable transaction. For detailed documentation visit [knex docs](http://knexjs.org/#Installation-client "knexjs.org")

```js
const { db } = require("@hkbyte/sql")

// Database configurations
const config = {
	client: "pg", // client adapter 'pg' or 'mysql2'
	connection: {
		host: "localhost", // host address
		port: "5432", // port no
		user: "postgres", // database username
		password: "postgres", // database password
		database: "mydb" // database name
    }
}

// Creating Database Client
const dbClient = db.create(config)
```

<br>

### **Executing SQL Query :**<br>
Executing SQL query with binding parameters which will take raw SQL query and Array of binding parameters as arguments, will return Promise.

```js
// Executing Query
const result = await dbClient.query("SELECT * from users WHERE id = ?", [3]) // returns <Promise>

// Output from Result of Query
console.log(result.rows)
```

<br>

### **SQL query building :**<br>
SQL query building is totally borrowed from Knex. You can chain multiple knex functions to dbClient.knex() function as shown in following examples to build query. For detailed documentation visit [knex](http://knexjs.org/#Builder "Knex Query Building")

```js
await dbClient.knex()
```

<br>

### **Select Query :**<br>
Select Query Example with knex query building. More at [knex](http://knexjs.org/#Builder-select "Knex Select")

```js
await dbClient.knex().select('title', 'author', 'year').from('books')
```
>Output:<br>
>select "title", "author", "year" from "books"

<br>

### **Insert Query :**<br>
Insert Query Example with knex query building. More at [knex](http://knexjs.org/#Builder-insert "Knex Insert")

```js
await dbClient.knex('books').insert({title: 'Life is awesome'})
```
>Output:<br>
>insert into "books" ("title") values ('Life is awesome')

<br>

### **More on Query building :**<br>
Checkout more chainable functions for queries for UPDATE, DELETE, JOIN, UNION, etc. in detail on [knex](http://knexjs.org/#Builder "Knex Query Building"). It has vast set of flexibility from which you can build sql queries with ease. 

<br>


### **Creating Sharable SQL Transaction :**<br>
Below code will create sharable SQL transaction by passing above created dbClient as argument. We will see how sharable transaction work in a moment, first see how normal transaction works

```js
const { sqlTransaction } = require("@hkbyte/sql")

// Creating Sharable SQL Transaction
const sql = await sqlTransaction(dbClient)

```

>Simply use **sql** (SQL Transaction Client) instead of **dbClient** (Database Client) for executing queries in transaction. It supports all the knex functions with transaction.
```js
// Query Building with Transaction
await sql.knex()

// Executing Raw Query with Transaction
await sql.query("<-- SQL Query here -->")
```

**Start**, **Rollback** and **Commit** actions for transaction.
```js
// Start Transaction
await sql.start()

try{
	//
	// Execution SQL Queries with transaction
	//

	// Commit Transaction
	sql.commit()

}
catch(err){
	// Rollback Transaction
	sql.rollback()
}
```

<br>

**Example of query execution with transaction :**<br>

```js
const { sqlTransaction } = require("@hkbyte/sql")

const state = {
	name: 'Gujarat',
	cities: [
		'Ahmedabad',
		'Gandhinagar',
		'Surat',
		'Vadodara',
		'Rajkot'
	]
}

// Creating Sharable SQL Transaction
const sql = await sqlTransaction(dbClient)

try{
	// Start Transaction
	await sql.start()

	// Inserting State into states table
	const insertState = await sql.knex("states")
		.insert({name: state.name})
		.returning("id")

	// Mapping Cities
	const cities = states.cities.map(city => {
		return {
			name: city.name,
			state_id: insertState[0]
		}
	})

	// Batch Insertion of Cities with transaction
	const batchInsertCities = await sql.knex.batchInsert("cities", cities)

	// Commit Transaction
	sql.commit()
}
catch(err){
	// Rolback Transaction
	sql.rollback()
}
```

<br>

### **Sharing Transaction :**
Below example shows how we can create transaction client with using transaction of parent transaction client.
```js
const { sqlTransaction } = require("@hkbyte/sql")

// Creating Sharable SQL Transaction
const sql = await sqlTransaction(dbClient)

// Sharing Transaction from sql
const sql2 = await sqlTransaction(dbClient, sql.trx)
```
> By doing **Commit** and **Rollback** actions by child transaction won't affect transaction at all. Only parent client has right to make transation termination actions. You can also share parent transaction to thier child tranaction (nested method).

<br>

## Best Practises of using shared transactions :
Create functions which can take parent transaction if provided or create own transaction client as shown in below example.
```js
const { sqlTransaction } = require("@hkbyte/sql")

async function addCities(payload, trx = null){
	const {stateCities, state_id} = payload

	// Creating SQL Transaction Client
	const sql = await sqlTransaction(dbClient, trx)
	// It will create child transaction if parent provides it or it will create own transaction client

	try{
		// Mapping Cities
		const cities = stateCities.map(city => {
			return {
				name: city.name,
				state_id
			}
		})

		// Batch Insertion of Cities with transaction
		const batchInsertCities = await sql.knex.batchInsert("cities", cities)
		
		// Commit Transaction
		sql.commit()

	}
	catch(err){
		// Rolback Transaction
		sql.rollback()
	}
}

async function addState(payload, trx = null){
	const { name } = payload

	// Creating SQL Transaction Client
	const sql = await sqlTransaction(dbClient, trx)
	// It will create child transaction if parent provides it or it will create own transaction client

	try{
		// Commit Transaction
		sql.commit()

		// Inserting State into states table
		const insertState = await sql.knex("states")
			.insert({name: state.name})
			.returning("id")

		// Sharing Transaction
		await addCities(state.cities, sql.trx)

		// returns insert id
		return insertState[0]
	}
	catch(err){
		// Rolback Transaction
		sql.rollback()
	}
}

const state = {
	name: 'Gujarat',
	cities: [
		'Ahmedabad',
		'Gandhinagar',
		'Surat',
		'Vadodara',
		'Rajkot'
	]
}

addState(state)
// This function will create transaction and will share it with addCitites function

addCities({
	stateCities: [
		'Mumbai',
		'Pune',
		'Nagpur',
		'Solapur'
	],
	state_id: 4
})
// This function will create its own transaction

```

<br>

* From implementing above example we can achive sharable transaction ecosystem.
* Each function can use provided transaction or create own if not provided, it results less repetation of same sql logic.
* No need to maintain rollback and commit in shared transaction child functions, it will be handled by parent transaction client.
