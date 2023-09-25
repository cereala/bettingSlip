# Betting Slip REST API - Using NodeJS, TypeScript, JWT, Passport & Postgresql

## NOTES 

Follow the below steps to run the Betting Slip REST API on your machine.

## Prerequisites

### [PostgreSQL needs to be installed on your machine](https://www.postgresql.org/download/)
### [NodeJS needs to be installed locally](https://nodejs.org/en/download)
### [Postman also needs installation to test the endpoints for the API](https://www.postman.com/downloads/) 
Export Postman Collection file which contains endpoints to interact with the API: *Betting Slips.postman_collection.json*

## Clone project
Create a new folder and run in the terminal : git clone https://github.com/cereala/bettingSlip.git

Open the project in your prefered IDE and run in the terminal **_npm i_**

## Initialize PostgreSQL database schema
Open pgAdmin and create a database called **bettingslip**

Open **database.json** file and change it with your default user and password for your PostgreSQL instance

Run in the terminal in the root project folder : **db-migrate up initialize**

This will create the schema and table structure needed by the project.

## Run the API
Build the JS files with **npm run build**

**OR**

Transpile the TS files to JS in watch mode with: *tsc -w*

Both commands will create a dist folder which has the identical structure but with JS files which the browser can interpret

This command will start the server at localhost:8989
**npm start**

You should see a message in the console like: *Server running on port 8989*

