require("dotenv").config()
const { Pool, types } = require("pg");

// Parse dates in database as a string

types.setTypeParser(1082, function (stringValue) {
	return stringValue;
});

//Connect to the database

isProduction = (process.env.NODE_ENV === "production");
var pool;
if(isProduction)	{
	pool = new Pool({
		connectionString: process.env.DATABASE_URL
	});
} else	{
	pool = new Pool();
}

module.exports = {
	query: (text, params) => pool.query(text, params),
};