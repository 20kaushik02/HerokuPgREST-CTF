require("dotenv").config();
const jwt = require("jsonwebtoken");

function jwtGen(username) {
	const payload = {
		user: username,
	};

	return jwt.sign(payload, `${process.env.jwtSecret}`, { expiresIn: "1h" });
}

module.exports = jwtGen;
