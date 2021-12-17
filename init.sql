\c postgres;
DROP DATABASE IF EXISTS userprod_api;
CREATE DATABASE userprod_api;
\c userprod_api;
CREATE SCHEMA IF NOT EXISTS product_db_schema;
ALTER DATABASE userprod_api SET search_path TO userprod_api_schema, public;

CREATE SEQUENCE IF NOT EXISTS products_pk_seq START 20000;

CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(255) NOT NULL,
	password VARCHAR(100) NOT NULL,
	phone VARCHAR(255) NOT NULL,
	DOB DATE NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS products (
	id INT NOT NULL DEFAULT nextval('products_pk_seq'),
	product VARCHAR(255) NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (id)
);
