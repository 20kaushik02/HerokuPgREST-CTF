<h1>HerokuPgREST-CTF</h1>
<h2>Simple REST API using Express (Node.js) and PostgreSQL as the database engine</h2>
<h3>FOR DEVELOPMENT ENVIRONMENTS</h3>
<h4>.env should contain information in accordance with the following:</h4>
<code>
<ul>
<li><strong>PORT</strong> = random_port_such_as_9001</li>
<li><strong>PGHOST</strong> = 'localhost'</li>
<li><strong>PGPORT</strong> = 5432</li>
<li><strong>PGUSER</strong> = your_postgres_username/role</li>
<li><strong>PGPASSWORD</strong> = your_postgres_password</li>
<li><strong>PGDATABASE</strong> = db_name</li>
<li><strong>jwtSecret</strong> = 'this is a secret phrase for JWT token encryption'</li>
<li><strong>NODE_ENV</strong> = development</li>
</ul>
</code><br>
<h3>FOR PRODUCTION ENVIRONMENTS</h3>
<h4>Configuration/environment variables of the hosted application must be set in accordance with the following:</h4>
<code>
<ul>
<li><strong>DATABASE_URL</strong> must be of the form of <code>postgres://user:password@host:port/database</code></li>
<li><strong>jwtSecret</strong> = 'this is a secret phrase for JWT token encryption'</li>
<li><strong>NODE_ENV</strong> = production</li>
<li><strong>PGSSL_MODE</strong> = no-verify</li>
<li><strong>PORT</strong> = random_port_such_as_9001</li>
</ul>
</code><br>
<h4><a href="https://herokupgrest-ctf.herokuapp.com">App URL: https://herokupgrest-ctf.herokuapp.com(Heroku)</a></h4><br>
Routes:

	/api/auth

		/register --- Register

			-POST request with username, password, name, phone and dob (YYYY-MM-DD)
			Body:	{
				"username": "user",
				"password":	"pwd",
				"name":		"name"
				"phone":	"1234567890",
				"dob":		"1970-01-01"
			}
			Returns new JWToken

		/login --- Log in

			-POST request with username, password
			{
				"username": "user",
				"password":	"pwd"
			}
			Returns new JWToken

		Retrieve list of all users
			-GET request
			Returns array of details of all users

		Update user (self) details
			-PUT request with name, phone, dob and JWToken
			Body:	{
				"name":		"new name"
				"phone":	"0987654321",
				"dob":		"2000-12-12",
			}
			Headers:	{
				"JWToken":	insert token from login/register
			}
			Returns updated user details

		Delete user (self)
			-DELETE request with JWToken
			Headers:	{
				"JWToken":	insert token from login/register
			}
			Returns details of deleted user (self)
		
	/api/products

		Add new product
			-POST request with product, quantity, and JWToken
			Body:	{
				"product":	"product_name",
				"quantity":	product_quantity
			}
			Headers:	{
				"JWToken":	insert token from login/register
			}
			Returns new product details

		Retrieve list of all products
			-GET request

		Edit product quantity
			-PUT request with id, quantity, and JWToken
			Body:	{
				"id":	product_id,
				"quantity":	product_quantity
			}
			Headers:	{
				"JWToken":	insert token from login/register
			}
			Returns updated product details

		Delete product
			-DELETE request with id and JWToken
			Headers:	{
				"JWToken":	insert token from login/register
			}
			Parameters:	{
				"id":	product_id
			}