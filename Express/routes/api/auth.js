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
	await db.query("BEGIN");

	try {
		const { username, password, phone, dob } = req.body;
		const user = await db.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);

		if (user.rows.length > 0) {
			return res.status(403).json({
				status: "failure",
				msg: "User already exists!",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const bcryptPassword = await bcrypt.hash(password, salt);
		const newUser = await db.query(
			"INSERT INTO users (username, password, phone, dob)	VALUES ($1, $2, $3, $4) RETURNING *",
			[username, bcryptPassword, phone, dob]
		);

		console.log(newUser.rows[0]);
		const jwtToken = jwtGenerator(newUser.rows[0].username);

		await db.query("COMMIT");
		return res.status(201).json(jwtToken);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

// User login

router.post("/login", credCheck, async (req, res) => {
	await db.query("BEGIN");

	try {
		const { username, password } = req.body;
		console.log(username);
		const user = await db.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);

		if (user.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg: "User does not exist!"
			});

		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json({
				status: "failure",
				msg: "Invalid username or password",
			});
		}

		const jwtToken = jwtGenerator(user.rows[0].username);

		await db.query("COMMIT");

		return res.json(jwtToken);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

// Retrieve list of users

router.get("/", async (req, res) =>	{
	try {
		const users = await db.query(
			"SELECT username, phone, dob FROM users ORDER BY username"
		);
		console.log(users.rows);
		return res.status(200).json(users.rows);
	} catch (error) {
		console.error(error);
	}
});

// Update user phone no. and DOB

router.put("/", tokenCheck, async (req, res) => {
	await db.query("BEGIN");

	try {
		const { verified_user } = req;
		const { phone, dob } = req.body;

		const updatedUser = await db.query(
			"UPDATE users SET phone=$1, dob=$2 WHERE username = $3 RETURNING phone, dob",
			[phone, dob, verified_user]
		);

		if (updatedUser.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg: "User does not exist!"
			});
		console.log(updatedUser.rows[0]);

		await db.query("COMMIT");

		return res.status(201).json(updatedUser.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

// Delete user

router.delete("/", tokenCheck, async (req, res) => {
	await db.query("BEGIN");
	
	try {
		const { verified_user } = req;
		const deleted = await db.query(
			"DELETE FROM users WHERE username = $1 RETURNING username, phone, dob",
			[verified_user]
		);

		if (deleted.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg: "User does not exist!"
			});
		console.log(deleted.rows[0]);

		await db.query("COMMIT");
		return res.status(200).json(deleted.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

module.exports = router;