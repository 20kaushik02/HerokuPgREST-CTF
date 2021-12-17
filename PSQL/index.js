/*
.env should contain information similar to the following:

PORT = 9001
PGHOST = 'localhost'
PGPORT = 5432
PGUSER = your postgres username/role
PGPASSWORD = your postgres password
PGDATABASE = db_name
jwtSecret = 'this is a secret phrase for JWT token encryption'
*/

const { Pool, types } = require("pg");

// Parse dates in database as a string

types.setTypeParser(1082, function (stringValue) {
	return stringValue;
});

//Connect to the database

isProduction = (process.env.NODE_ENV === "production");
const pool = new Pool({
	host:	isProduction? "ec2-18-211-185-154.compute-1.amazonaws.com":process.env.PGHOST,
	port:	isProduction? 5432:process.env.PGPORT,
	user:	isProduction? "nmsqraaifwfpuh":process.env.PGUSER,
	password:	isProduction? "39413324caf966d5849359279d376ad392d376d0d23e7ba8b7a0dfe7fcac093a":process.env.PGPASSWORD,
	database:	isProduction? "d69rq97kelg63o":process.env.PGDATABASE,
});

module.exports = {
	query: (text, params) => pool.query(text, params),
};