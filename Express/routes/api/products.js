const express = require("express");
const router = express.Router();

const db = require("../../../PSQL");

const tokenCheck = require("../../middleware/tokenCheck");

// Create new product

router.post("/", tokenCheck, async (req, res) => {
	try {
		await db.query("BEGIN");
		
		const { product, quantity } = req.body;
		if(!product || !quantity)
			return res.status(400).json({
				status:	"failure",
				msg:	"Missing request body fields"
			});

		const newProduct = await db.query(
			"INSERT INTO products (product, quantity) VALUES ($1, $2) RETURNING *",
			[product, quantity]
		).catch(err => { throw err; });
		console.log(newProduct.rows[0]);
		
		await db.query("COMMIT");
		return res.status(201).json(newProduct.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Retrieve list of products

router.get("/", async (req, res) => {
	try {
		const products = await db.query(
			"SELECT * FROM products ORDER BY id"
		).catch(err => { throw err; });
		console.log(products.rows);
		return res.status(200).json(products.rows);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Update product quantity

router.put("/", tokenCheck, async (req, res) => {
	try {
		await db.query("BEGIN");
		
		const { id, quantity } = req.body;
		if(!id || !quantity)
			return res.status(400).json({
				status:	"failure",
				msg:	"Missing request body fields"
			});

		const updatedProduct = await db.query(
			"UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *",
			[quantity, id]
		).catch(err => { throw err; });
		if (updatedProduct.rows.length === 0)
			return res.status(404).json({
				status: "failure",
				msg:	"Product not found"
			});
		console.log(updatedProduct.rows[0]);

		await db.query("COMMIT");
		return res.status(201).json(updatedProduct.rows[0]);
	} catch (error) {
		console.error(error);
		await db.query("ROLLBACK");
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

// Delete product

router.delete("/", tokenCheck, async (req, res) =>	{
	try {
		await db.query("BEGIN");
		
		const id = parseInt(req.query.id);
		if (!id || !Number.isInteger(id))
			return res.status(400).json({
				status: "failure",
				msg:	"Bad parameter"
			});
		
		const deleted = await db.query(
			"DELETE FROM products WHERE id = $1 RETURNING *",
			[id]
		).catch(err => { throw err; });
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
		return res.status(500).json({
			status: "failure",
			msg:	`Error: ${error.message}`
		});
	}
});

module.exports = router;