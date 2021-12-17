require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware to check if JWT token is valid

function validTokenTest(req, res, next) {
	const token = req.header("JWToken");
	if (!token) {
		return res.status(403).json({
			msg: "Authorization Denied"
		});
	}

	try {
		const verify = jwt.verify(token, `${process.env.jwtSecret}`);
		req.verified_user = verify.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token Invalid" });
	}
}

module.exports = validTokenTest;
