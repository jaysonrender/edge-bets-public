
//package for using .env variables
require('dotenv').config()

//package for running javascript server
const express = require('express');
const cors = require('cors');
const createConnection = require('./database/dbConnect');
const initSportsData = require('./database/initSportsData');

async function initDB() {
    //attempt to connect to db, if connection fails, address problem to initialize a database
    //This app requires MySql to be installed and running and env.HOST env.DB_PORT variable set to that
    try {
        const db = await createConnection();
        db.end();

    } catch(error){
        console.log(error.errno);
        //if database does not exist, run script to create database and fill with initial data like teams, game schedule, and root users
        if(error.errno === 1049){
            initSportsData();
        }
        //TODO: add other sql errors to handle them properly and set up database properly
    }
}

//functions for handling http requests for various URIs
const pickRoutes = require('./routes/pickRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json()); //middleware for parsing json
app.use(cors());
app.use('/api/pick', pickRoutes); //middleware for handling picks and game information
app.use('/api/user', userRoutes); //middleware for handling users and user info

//when starting server, check if database already exists and is open for connections. if not start a database
//initDB();

app.listen(process.env.PORT, () => {
    console.log('Listening on port ' + process.env.PORT);
});