DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP SEQUENCE IF EXISTS products_pk_seq;

CREATE SEQUENCE products_pk_seq START 20000;

CREATE TABLE users (
	username VARCHAR(255) NOT NULL,
	password VARCHAR(100) NOT NULL,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE products (
	id INT NOT NULL DEFAULT nextval('products_pk_seq'),
	product VARCHAR(255) NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (id)
);
