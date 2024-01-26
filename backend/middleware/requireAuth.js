//runs before anything in picksController
//if user is not logged in or doesn't have valid JSON Web Token, they won't be able to make calls to backend API

const jwt = require('jsonwebtoken');
const createConnection = require('../database/dbConnect');
const fs = require('fs');


async function requireAuth(request, response, next) {
    const {authorization } = request.headers;

    if(!authorization)
        return response.status(401).json({message: "Authorization token required"});

    //authorization = `Bearer ${userToken}`
    const token = authorization.split(' ')[1];
    const db = await createConnection();

    try{
        const { leagueID, userID } = jwt.verify(token, process.env.JWT_SECRET);
                
        const query = fs.readFileSync('./database/queries/getUserByID.sql', 'utf8');
        const [result] = await db.execute(query, [leagueID, userID], (error, results, fields) => {
            if (error){
                console.log(error.message);
            }
        }) ;
        
        next();

    } catch (error) {
        response.status(401).json({error: 'Request is not authorized', message: error.message});
    } finally {
        await db.end();
    }
}

module.exports = requireAuth;