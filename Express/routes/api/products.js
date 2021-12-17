const express = require("express");
const router = express.Router();

const db = require("../../../PSQL");

const tokenCheck = require("../../middleware/tokenCheck");

// Create new product

router.post("/", tokenCheck, async (req, res) => {
	await db.query("BEGIN");

	try {
		const { product, quantity } = req.body;
		if (!Number.isInteger(quantity) || !(typeof (product) === 'string'))
			return res.status(400).json({
				status: "failure",
				msg: "Bad parameter types"
			});

		const newProduct = await db.query(
			"INSERT INTO products (product, quantity) VALUES ($1, $2) RETURNING *",
			[product, quantity]
		);
		console.log(newProduct.rows[0]);
		
		await db.query("COMMIT");
		return res.status(201).json(newProduct.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

// Retrieve list of products

router.get("/", async (req, res) => {
	try {
		const products = await db.query(
			"SELECT * FROM products ORDER BY id"
		);
		console.log(products.rows);
		return res.status(200).json(products.rows);
	} catch (error) {
		console.error(error);
	}
});

// Update product quantity

router.put("/", tokenCheck, async (req, res) => {
	await db.query("BEGIN");

	try {
		const { id, quantity } = req.body;
		if (!Number.isInteger(id) || !Number.isInteger(quantity))
			return res.status(400).json({
				status: "failure",
				msg: "Bad parameter types"
			});

		const updatedProduct = await db.query(
			"UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *",
			[quantity, id]
		);
		if (updatedProduct.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg: "Product not found"
			});
		console.log(updatedProduct.rows[0]);

		await db.query("COMMIT");
		return res.status(201).json(updatedProduct.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
	}
});

// Delete product

router.delete("/", tokenCheck, async (req, res) =>	{
	await db.query("BEGIN");
	
	try {
		const id = parseInt(req.query.id);
		if (!Number.isInteger(id))
			return res.status(400).json({
				status: "failure",
				msg:	"Bad parameter types"
			});
		
		const deleted = await db.query(
			"DELETE FROM products WHERE id = $1 RETURNING *",
			[id]
		);
		if(deleted.rows.length === 0)
			return res.status(404).json({
				status:	"failure",
				msg:	"Product not found"
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