# This package contains both backend and frontend parts of the project.

Frontend application is using following packages:

- Angular 18
- Angular Material
- Tailwind CSS
- Cypress
- ESLint
- Prettier


## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js: You can download and install Node.js from [here](https://nodejs.org/).
- npm (Node Package Manager): This is included with Node.js.

To check if you have Node.js and npm installed, run:

```bash
node -v
npm -v
```

## Getting Started

Follow these steps to set up and run the application on your local machine:

1. Clone the Repository
   <br />If you haven't already, clone the repository to your local machine. For example:

```bash
git clone https://github.com/happyBanshee/aab-server.git
cd aab-server
```

2. Install Dependencies
   <br />In the project root directory, run the following commands to install the necessary dependencies:

```bash
npm install
cd frontend
npm install
```

This will install the required packages listed in package.json for both the backend and frontend parts of the project.

3. Run the Server
   <br />After installing the dependencies, you can start the server using the following command:

```bash
npm run start
```

The server will start and listen on port 3000 by default. You should see a message like:

```bash
Server is running on http://localhost:3000
```

4. Start frontend application
   <br />After installing the dependencies, you can start the frontend using the following command:

```bash
cd frontend
npm run start
```

The frontend application runs on port 4200 by default.

5. Unit tests
    <br />To run the unit tests, run the following command from the `frontend` folder.

 ```bash
npm run test
```

6. E2E tests
    <br />To run the Sypress E2E test, run the following command from the `frontend` folder.
   Make sure that the Angular development server is **not** running before running the end-to-end tests. Otherwise, the Cypress server might be running on the port that is not included to the CORS settings fo the BE server.
    
```bash
npm run e2e
```