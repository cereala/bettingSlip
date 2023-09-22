# Betting Slip REST API - Using NodeJS, TypeScript, JWT, Passport & Postgresql

## NOTES 

Follow the below steps to run the Betting Slip REST API on your machine.

## Prerequisites

### PostgreSQL needs to be installed on your machine
### NodeJS needs to be installed locally
### Postman is needed to test the endpoints for the API
Export Postman Collection file which contains endpoints to interact with the API: *Betting Slips.postman_collection.json*


## Initialize PostgreSQL database schema
Open database.json file and change it with your default user and password for PostgreSQL
Run in the terminal in the root folder : db-migrate up initialize

## Run the API
Transpile the TS files to JS with: *tsc -w*
This will create a dist folder which has the identical structure but with JS files which the browser can interpret

This command will start the server at localhost:8989
npm start

You should see a message in the console like: *Server running on port 8989*

