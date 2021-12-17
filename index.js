require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./PSQL");

const app = express();

app.use(express.json());
app.use(cors());

const API_PATH = "./Express/routes/api";

app.use("/api/auth", require(`${API_PATH}/auth`));
app.use("/api/products", require(`${API_PATH}/products`))

const port = process.env.PORT || 9000;

app.listen(port, () => {
	console.log(`Server started - ${port}`);
});