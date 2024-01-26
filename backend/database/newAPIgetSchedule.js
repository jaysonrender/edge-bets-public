require('dotenv').config();
const axios = require('axios');
const mysql2 = require('mysql2');
const knex = require('knex')(JSON.parse(process.env.KNEX));

async function getTeams() {
    
    let parsedResult = [];
    

    const {data} = await axios.get("https://api.mysportsfeeds.com/v2.1/pull/nfl//2023-2024-regular/venues.json", 
    {
        headers: {
            'Authorization': `Basic ${process.env.NEW_API}`
        }
    });

    console.log(data.venues.length);

    for (venue of data.venues) {
        if (venue.homeTeam !== null) {
            console.log(venue.homeTeam.abbreviation);
        }
    }
}

async function getSchedule() {
    let parsedResult = [];

    const {data} = await axios.get("https://api.mysportsfeeds.com/v2.1/pull/nfl/2023-2024-regular/games.json", 
    {
        headers: {
            'Authorization': `Basic ${process.env.NEW_API}`
        }
    });

    for (game of data.games) {
        let season = process.env.SEASON;
        let week = game.schedule.week;
        let gameID = game.schedule.id.toString();
        let homeAlias = game.schedule.homeTeam.abbreviation;
        let awayAlias = game.schedule.awayTeam.abbreviation;
        let gameTime = game.schedule.startTime.slice(0, -1).concat('+00:00');
        

        let entry = {season: season, nfl_week: week, game_id: gameID, home: homeAlias, away: awayAlias, game_time: gameTime};
        parsedResult.push(entry);
    }
        // console.log(parsedResult);
    return parsedResult;
    
}

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

        let homeEntry = {'nfl_week': week, 'team_alias': homeAlias, 'score': homePointDiff};
        parsedResult.push(homeEntry);

        let awayEntry = {'nfl_week': week, 'team_alias': awayAlias, 'score': awayPointDiff};
        parsedResult.push(awayEntry);

    }

    console.log(parsedResult);
}

async function main() {
    const schedule = await getSchedule();
    console.log(schedule);
    await knex('game_schedule').insert(schedule).onConflict('game_id').merge()
        .then((res) => {
            // console.dir(schedule, {'maxArrayLength': null})
            ; 
        });

    await knex.select().table('game_schedule');

    knex.destroy();

    // getScoresFromAPI(1);
}

main();