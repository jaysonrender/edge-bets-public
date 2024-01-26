require('dotenv').config({path: '../.env'});


const mysql2 = require('mysql2');
const createConnection = require('../dbConnect');
const fs = require('fs');
const axios = require('axios');
const getCurrentWeek = require('../../util/getCurrentWeek');

//TODO: need to integrate into backend server
    // add query to update scores, not just insert scores
    // how to start updating scores when games start?
    // update in real time or periodically?
    // refactor with new API
        //include logo image url?

const scriptTime = process.argv[2] * 60 * 60 * 1000; //convert argument in hours to milliseconds for setTimeout
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

    const date = new Date();
    fs.writeFileSync(`../log/scoresWeek${getCurrentWeek(new Date())}.txt`, JSON.stringify({"Date Updated": date, "data": parsedResult }, {'flag': 'w'}));
    return parsedResult;

}

async function insertOrUpdateScores() {
    const scores = await getScoresFromAPI(process.env.SCORE_WEEK);
    const db = await createConnection()

    const scoreQuery = fs.readFileSync('../queries/insertOrUpdateScores.sql', 'utf8');

    for (score of scores){
        try{
            db.execute(scoreQuery, [process.env.SEASON, score.nfl_week, score.team_alias, score.score, score.score], (error, rows, fields) => {
                if (error)
                    throw error;
            });
            //console.log('success');
        }catch (error) {
            fs.writeFile(`../log/scoresWeek${getCurrentWeek(new Date() - 1)}ERROR.txt`, JSON.stringify({"ERROR DATE": new Date(), "data": error.message}));
            console.log(error)
        }
    }
    
    db.unprepare(scoreQuery);
    
    await db.end();
}
async function terminate(intervalID) {
    const finalScores = await getScoresFromAPI(process.env.SCORE_WEEK);
    console.log(finalScores);
    console.log('getScoresFromAPI script finished.');
    clearInterval(intervalID);
}

insertOrUpdateScores();
const intervalID = setInterval(insertOrUpdateScores, 60000);
setTimeout(terminate, scriptTime, intervalID);

