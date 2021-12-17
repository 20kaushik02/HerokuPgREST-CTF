require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../../../PSQL");

const jwtGenerator = require("../../JWTGenerator");
const credCheck = require("../../middleware/missingCred");
const tokenCheck = require("../../middleware/tokenCheck");

// Create new user

router.post("/register", credCheck, async (req, res) => {
	try {
		await db.query("BEGIN");

		const { username, password, phone, dob } = req.body;
		if (!username || !password || !phone || !dob)
			res.status(400).json({
				status: "failure",
				msg:	"Missing request body fields"
			});
		const user = await db.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		).catch(err => { throw err; });

		if (user.rows.length > 0) {
			return res.status(403).json({
				status: "failure",
				msg:	"User already exists!",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const bcryptPassword = await bcrypt.hash(password, salt);
		const newUser = await db.query(
			"INSERT INTO users (username, password, phone, dob)	VALUES ($1, $2, $3, $4) RETURNING *",
			[username, bcryptPassword, phone, dob]
		).catch(err => { throw err; });

		console.log(newUser.rows[0]);
		const jwtToken = jwtGenerator(newUser.rows[0].username);

		await db.query("COMMIT");
		return res.status(201).json(jwtToken);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// User login

router.post("/login", credCheck, async (req, res) => {
	try {
		await db.query("BEGIN");

		const { username, password } = req.body;
		if (!username || !password)
			return res.status(400).json({
				status: "failure",
				msg: "Missing request body fields"
			});
		console.log(username);
		const user = await db.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		).catch(err => { throw err; });

		if (user.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg:	"User does not exist!"
			});

		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json({
				status: "failure",
				msg:	"Invalid username or password",
			});
		}

		const jwtToken = jwtGenerator(user.rows[0].username);

		await db.query("COMMIT");

		return res.json(jwtToken);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Retrieve list of users

router.get("/", async (req, res) => {
	try {
		const users = await db.query(
			"SELECT username, phone, dob FROM users ORDER BY username"
		).catch(err => { throw err; });
		console.log(users.rows);
		return res.status(200).json(users.rows);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Update user phone no. and DOB

router.put("/", tokenCheck, async (req, res) => {
	try {
		await db.query("BEGIN");

		const { verified_user } = req;
		const { phone, dob } = req.body;
		if (!phone || !dob)
			return res.status(400).json({
				status: "failure",
				msg:	"Missing request body fields"
			})

		const updatedUser = await db.query(
			"UPDATE users SET phone=$1, dob=$2 WHERE username = $3 RETURNING phone, dob",
			[phone, dob, verified_user]
		).catch(err => { throw err; });

		if (updatedUser.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg:	"User does not exist!"
			});
		console.log(updatedUser.rows[0]);

		await db.query("COMMIT");

		return res.status(201).json(updatedUser.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Delete user

router.delete("/", tokenCheck, async (req, res) => {
	try {
		await db.query("BEGIN");

		const { verified_user } = req;
		const deleted = await db.query(
			"DELETE FROM users WHERE username = $1 RETURNING username, phone, dob",
			[verified_user]
		).catch(err => { throw err; });

		if (deleted.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg:	"User does not exist!"
			});
		console.log(deleted.rows[0]);

		await db.query("COMMIT");
		return res.status(200).json(deleted.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

module.exports = router;