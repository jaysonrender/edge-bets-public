require('dotenv').config();

const mysql2 = require('mysql2');
const createConnection = require('../database/dbConnect');
const fs = require('fs');
const axios = require('axios');

//TODO: need to integrate into backend server
    // add query to update scores, not just insert scores
    // how to start updating scores when games start?
    // update in real time or periodically?
    // refactor with new API
        //include logo image url?
async function getScoresFromAPI(week){
    
    const parsedResult = []

    
    const {data} = await axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nfl/2023-2024-regular/week/${week}/games.json`, 
    {
        headers: {
            'Authorization': `Basic ${process.env.NEW_API}`
        }
    });

    for (game of data.games) {

        const homeAlias = game.schedule.homeTeam.abbreviation;
        let homePointDiff = 0;

        const awayAlias = game.schedule.awayTeam.abbreviation;
        let awayPointDiff = 0;

        if (game.score.homeScoreTotal != null && game.score.awayScoreTotal != null) {
            
            homePointDiff = game.score.homeScoreTotal - game.score.awayScoreTotal;
            awayPointDiff = game.score.awayScoreTotal - game.score.homeScoreTotal;
        }

        let homeEntry = {'season': process.env.SEASON, 'nfl_week': week, 'team_alias': homeAlias, 'score': homePointDiff};
        parsedResult.push(homeEntry);

        let awayEntry = {'season': process.env.SEASON, 'nfl_week': week, 'team_alias': awayAlias, 'score': awayPointDiff};
        parsedResult.push(awayEntry);

    }

    console.log(parsedResult);
    return parsedResult;

}

async function insertOrUpdateScores() {
    const scores = await getScoresFromAPI(process.env.SCORE_WEEK);
    const db = await createConnection()

    const scoreQuery = fs.readFileSync('../database/queries/insertOrUpdateScores.sql', 'utf8');

    for (score of scores){
        try{
            db.execute(scoreQuery, [process.env.SEASON, score.nfl_week, score.team_alias, score.score, score.score], (error, rows, fields) => {
                if (error)
                    throw error;
            });
            //console.log('success');
        }catch (error) {
            console.log(error)
        }
    }
    
    db.unprepare(scoreQuery);
    
    await db.end();
}

insertOrUpdateScores();
const intervalID = setInterval(insertOrUpdateScores, 60000);
setTimeout(clearInterval, process.env.GET_SCORE_TIMEOUT, intervalID);
