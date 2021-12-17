// Middleware for checking if credentials are missing

function testMissing(req, res, next) {
	const { username, password, phone, dob } = req.body;
	if (req.path === "/register") {
		if (![username, password, phone, dob].every(Boolean)) {
			return res.status(400).json("Missing Credentials");
		}
	} else if (req.path === "/login") {
		if (![username, password].every(Boolean)) {
			return res.status(400).json("Missing Credentials");
		}
	}
	next();
}

module.exports = testMissing;
