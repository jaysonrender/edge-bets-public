
const createConnection = require('../database/dbConnect');
const fs = require('fs');
const getCurrentWeek = require('../util/getCurrentWeek');
require('dotenv').config();

//GET methods

async function getUserStats(request, response) {
    const { leagueID, userID } = request.params;
    

    const db = await createConnection();
    const statsQuery = fs.readFileSync('./database/queries/getUserByID.sql', 'utf8');
    try {
        const [result] = await db.execute(statsQuery, [leagueID, userID], (error, rows, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(statsQuery);

        //users stats
        response.status(200).json({
            fullname: result[0].fname + ' ' + result[0].lname,
            score: result[0].score,
            rank: result[0].player_rank,
            flexPicks: result[0].flex_picks
        })
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getAllUsersByLeague(request, response) {
    const { leagueID } = request.params;
    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/getAllUsersByLeague.sql', 'utf8');

    try {
        const [result] = await db.execute(query, [leagueID], (error, rows, fields) => {
            if (error) console.log(error);
        });
        db.unprepare(query);
        response.status(200).json(result);
    } catch(error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getAccountInfo(request, response) {
    const { leagueID, userID } = request.params;

    const db = await createConnection();
    const accountQuery = fs.readFileSync('./database/queries/getAccountInfo.sql', 'utf8');
    try {
        const [result] = await db.execute(accountQuery, [userID, leagueID], (error, rows, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(accountQuery);

        //fname, lname, username, email, league_name, league_id, paid_status
        response.status(200).json(result)
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getUserPicks(request, response) {
    const { userID, week } = request.params;
    
    
    const db = await createConnection();
    let picksQuery;
    let values;

    if (week === undefined){
        picksQuery = fs.readFileSync('./database/queries/getUserPicks.sql', 'utf8');
        values = [userID, process.env.SEASON];
    }
    else {
        picksQuery = fs.readFileSync('./database/queries/getUserPicksByWeek.sql', 'utf8');
        values = [userID, week, process.env.SEASON];
    }
    
    try {
        const [pickResults] = await db.execute(picksQuery, values, (error, rows, fields) => {
            if (error)
                console.log(error);
        });

        db.unprepare(picksQuery);
        response.status(200).json(pickResults);

        /**
         * Example Array of pickResults
         * [
                    {
                        "pick_week": 4,
                        "pick1": "ATL",
                        "pick1_name": "Atlanta Falcons",
                        "pick1_score": 3,
                        "pick2": "BAL",
                        "pick2_name": "Baltimore Ravens",
                        "pick2_score": -3,
                        "week_total": 0
                    },
                    {
                        "pick_week": 5,
                        "pick1": "MIA",
                        "pick1_name": "Miami Dolphins",
                        "pick1_score": -23,
                        "pick2": "MIN",
                        "pick2_name": "Minnesota Vikings",
                        "pick2_score": 7,
                        "week_total": -16
                    }
                ]
         */
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getAllPlayersPicksAndScores(request, response) {
    const { leagueID } = request.params;

    const db = await createConnection();

    const scoreQuery = fs.readFileSync('./database/queries/getUserScoreRank.sql', 'utf8');
    const picksQuery = fs.readFileSync('./database/queries/getUserPicks.sql', 'utf8');


    try {
        //first query pulls user's name score and rank
        const [scoreResults, fields] = await db.execute(scoreQuery, [leagueID], (error, rows, fields) => {
            if (error)
                console.log(error.message);

        });

        db.unprepare(scoreQuery);


        let formattedResult = [...scoreResults];
        for (let i = 0, length = formattedResult.length; i < length; i++) {
            let userID = formattedResult[i].user_id

            const [pickResults, fields] = await db.execute(picksQuery, [userID, process.env.SEASON], (error, rows, fields) => {
                if (error)
                    console.log(error.message);
            });
            Object.assign(formattedResult[i], { picks: pickResults })

        }
        db.unprepare(picksQuery);


        response.status(200).json(formattedResult);
        /*
            EXAMPLE JSON OF formattedResult
            {
                "user_id": 126,
                "username": "jayson",
                "fullname": "Jayson Render",
                "score": -16,
                "player_rank": 3,
                "picks": [
                    {
                        "pick_week": 4,
                        "pick1": "ATL",
                        "pick1_name": "Atlanta Falcons",
                        "pick1_score": 3,
                        "pick2": "BAL",
                        "pick2_name": "Baltimore Ravens",
                        "pick2_score": -3,
                        "week_total": 0
                    },
                    {
                        "pick_week": 5,
                        "pick1": "MIA",
                        "pick1_name": "Miami Dolphins",
                        "pick1_score": -23,
                        "pick2": "MIN",
                        "pick2_name": "Minnesota Vikings",
                        "pick2_score": 7,
                        "week_total": -16
                    }
                ]
            }
        
        */

    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getGamesByWeek(request, response) {
    const { pickWeek } = request.params;

    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/getGamesByWeek.sql', 'utf8');

    //const currentDate = new Date('2022-09-06T00:00:00'); //TODO: update this to be actual current date when new season starts
    try {
        const [results, fields] = await db.execute(query, [pickWeek, process.env.SEASON], (err, result, fields) => { });

        db.unprepare(query);
        response.status(200).json(results);

    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }


}

async function getGameTimesByWeek(request, response){
    const { week } = request.params;

    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/getGameTimesByWeek.sql', 'utf8');

    try {
        const [results, fields] = await db.execute(query, [week, process.env.SEASON], (err, result, fields) => { }) 
        db.unprepare(query);

        for(result of results){
            result.game_time = result.game_time.toLocaleString();
        }
        response.status(200).json(results);
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }

}

async function getAllGameTimes(request, response){
    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/getAllGameTimes.sql', 'utf8');
    try {
        const [results, fields] = await db.execute(query, [process.env.SEASON], (err, result, fields) => { });
        db.unprepare(query);

        response.status(200).json(results);
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

//get user info for users in 1st, 2nd, 3rd, 0th, and last place
async function getLeagueLeaders(request, response) {
    const { leagueID } = request.params;

    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/getLeagueLeaders.sql', 'utf8');

    try {
        //prepared statement needs leagueID 6 times
        const [result] = await db.execute(query, [leagueID, leagueID, leagueID, leagueID, leagueID, leagueID], (error, rows, fields) => {
            
            if (error)
                console.log(error);
        });

        db.unprepare(query);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getRemainingPicksByUser(request, response) {
    const {userID} = request.params;

    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/getRemainingPicksByUser.sql', 'utf8');

    try {
        const [result] = await db.execute(query, [userID, process.env.SEASON, userID, process.env.SEASON], (error, rows, fields) => {
            if (error)
                console.log(error);
        })
        
        db.unprepare(query);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json(error.message);
    } finally {
        await db.end();
    }
}

//POST methods
async function submitPick(request, response) {

    const { userID, pickWeek, pick1, pick2, flexPickStatus, autoPickStatus } = request.body;

    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/insertPicks.sql', 'utf8');
    const flexQuery = fs.readFileSync('./database/queries/updateUserFlexPick.sql', 'utf8');
    try {
        await db.execute(query, [process.env.SEASON, userID, pickWeek, pick1, pick2, autoPickStatus, pick1, pick2, autoPickStatus], (error, rows, fields) => {
            if (error)
                throw error;
        });
        db.unprepare(query);
        if (flexPickStatus > 0) {

            await db.execute(flexQuery, [flexPickStatus, userID], (error, rows, fields) => {
                if (error)
                    throw error;
            });
        }
         
        db.end((error) => {
            if (error)
                console.log(error);
                response.status(400).json({ errorMessage: error.message })
        });
        response.status(200).json({ message: 'Pick successfully submitted!' });
    } catch (error) {
        response.status(400).json(error);
    } finally {
        await db.end();
    }
}

//edit user information
async function editUserInfo(request, response) {
    const {userID, fieldToEdit, value} = request.body;
    if (fieldToEdit === 'email'){
        response.status(400).json({errorMessage: "Users cannot change their email at this time through Edge Bets. If you need your email changed for any reason please contact Grant at nflpickemco@gmail.com or Jayson at jayson.edgebets@gmail.com"})
        
    }

    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/editUserInfo.sql', 'utf-8');
    const values = [fieldToEdit, value, userID];

    const preparedQuery = await db.format(query, values);

    try {
        await db.execute(preparedQuery, [], (error, result, fields) => {
            if (error)
                console.log(error.errno)
        })
        response.status(200).json({errorMessage: "Successfully updated user info"});
    } catch (error) {
        console.log(error.errno)
        console.log(error.message)
        if (error.errno === 1062)
            response.status(400).json({errorNumber: error.errno, errorMessage: "Cannot update user info. Username/email already exists"});
        else if (error.errno === 1406)
            response.status(400).json({errorNumber: error.errno, errorMessage: "Could not update information. Character limit reached"});
        else{
            response.status(400).json({errorNumber: error.errno, errorMessage: error.message});
        }
    } finally {
        db.end();
    }

    //prepared statement 
    //try update users set ?? = ? where user_id = ?
    //catch error
        //errno === 1062
            //duplicate username or email
        //errno === 1406
            //Entry too long (30 characters)



    switch (fieldToEdit){
        case 'fname':
            break;
        case 'lname':
            break;
        case 'username':
            break;
        case 'email':
            break;
        default:
            response.status(400).json({errorMessage: ''})
    }
}

async function editPaidStatus(request, response){
    //[paid, unpaid] = request.body
    //query: update users set paid_status = true where user_id in ([paid])
    //other query: update users set paid_status = true where user_id in ([paid])
    const {paid, unpaid} = request.body;
    const db = await createConnection();

    const editPaidStatusQuery = fs.readFileSync('./database/queries/editPaidStatus.sql', 'utf-8');
    const values = [(paid.length === 0 ? null : paid), (unpaid.length === 0 ? null : unpaid)]
    
    try {
        const formattedQuery = await db.format(editPaidStatusQuery, [paid.join(",")])
        const [result] = await db.query(editPaidStatusQuery, values, (error, row, fields) => {
            if (error){
                response.status(400).json({ paid:paid, errno: error.errno, sql: error.sql, errorMessage: error.message })
            }
        });

        response.status(200).json({result: result, paid: paid.join(','), query:formattedQuery, errorMessage: 'Users\' paid status updated.'})
    } catch (error) {
        response.status(400).json({errorMessage: error.message});
    } finally {
        await db.end();
    }
}

//DELETE methods

//delete a pick
async function deletePick(request, response){
    const { userID, pickWeek, pick, flexPickStatus } = request.params;
    const db = await createConnection();
    let pickResult;
    //query to select the pick from db;
    const selectQuery = fs.readFileSync('./database/queries/getSingularPick.sql', 'utf8');
    try{
        const [result] = await db.execute(selectQuery, [process.env.SEASON, userID, pickWeek], (error, row, fields) => {
            if (error){
                response.status(400).json({ errorMessage: error.message })
            }
        });
        
        if (result.length === 0){
            response.status(400).json({errorMessage: 'No pick found with these parameters'});
            return;
        } else {
            pickResult = result[0];
        }

        db.unprepare(selectQuery);
        
    } catch (error) {
        response.status(400).json({errorMessage: error.message});
    }
    
    let deleteQuery;
    const flexUpdateQuery = fs.readFileSync('./database/queries/updateFlexPickOnDelete.sql', 'utf8');
    const deleteQueryValues = [process.env.SEASON, userID, pickWeek];
    
    //if pick = pick1 and pick2 != null
    if(pick === pickResult.pick1 && pickResult.pick2 !== null){
        deleteQuery = fs.readFileSync('./database/queries/deletePick1.sql', 'utf8');
    }
    //else if pick = pick1 and pick2 == null
    else if( pick == pickResult.pick1 ){
        //query to delete entire record for this pick
        deleteQuery = fs.readFileSync('./database/queries/deletePickForWeek.sql', 'utf8');
    } else if (pick == pickResult.pick2){
        //query to set pick2 = null  
        deleteQuery = fs.readFileSync('./database/queries/deletePick2.sql', 'utf8');
    }
    
    try {
        const [result] = await db.execute(deleteQuery, deleteQueryValues, (error, rows, fields) => {
            if (error){
                throw error;
            }
        });

        db.unprepare(deleteQuery);



        if(flexPickStatus === 'true'){
            db.execute(flexUpdateQuery, [userID], (error, rows, fields) => {
                if (error){
                    throw error;
                }
            })
            response.status(200).json({errorMessage: 'Pick deleted, flexPickStatus = true'})
        }
            
        else {response.status(200).json({errorMessage: 'Pick deleted, flexPickStatus = false', type: typeof(flexPickStatus)})}
     } catch (error) {
        response.status(400).json({errorMessage: error.message})
     } 
     
     
     finally{
        await db.end();
     }
      
    
        
    
        
}


//delete a user

//delete a league


//PATCH methods
//change user information

//change picks
async function editPick(request, response) {
    //{userID, week}
}


module.exports = { submitPick, 
                   getAllPlayersPicksAndScores, 
                   getUserPicks, 
                   getUserStats, 
                   getAllUsersByLeague,
                   getGamesByWeek, 
                   getGameTimesByWeek, 
                   getAllGameTimes, 
                   getLeagueLeaders, 
                   getRemainingPicksByUser, 
                   getAccountInfo,
                   editUserInfo,
                   editPaidStatus,
                   deletePick };