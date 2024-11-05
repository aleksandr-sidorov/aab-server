# Node.js Login API

This is a simple Node.js application that provides an API endpoint to handle login requests. It validates the following fields:

- Username: Only letters, between 4 and 254 characters.
- Password: Must contain at least one uppercase letter, one number, one special character, and be between 8 and 16 characters long.
- Email: Valid email format.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js: You can download and install Node.js from [here](https://nodejs.org/).
- npm (Node Package Manager): This is included with Node.js.

To check if you have Node.js and npm installed, run:

node -v
npm -v

## Getting Started

Follow these steps to set up and run the application on your local machine:

1. Clone the Repository
   If you haven't already, clone the repository to your local machine. For example:

git clone https://github.com/yourusername/node-login-api.git
cd node-login-api 2. Install Dependencies
In the project directory, run the following command to install the necessary dependencies:

npm install
This will install the required packages listed in package.json, including express.

3. Run the Server
   After installing the dependencies, you can start the server using the following command:

node server.js
The server will start and listen on port 3000 by default. You should see a message like:

Server is running on http://localhost:3000 4. Test the API
You can now test the API using tools like Postman or curl. Below are the steps to test the login endpoint.

Endpoint:
POST /register
Request Body:
The body of the request should be in JSON format and contain the following fields:

username: A string containing only letters (between 4 and 254 characters).
password: A string that contains at least one uppercase letter, one number, one special character, and is between 8 and 16 characters long.
email: A valid email format.

Example:
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"username": "myuser", "password": "Password123!", "email": "user@example.com"}'
