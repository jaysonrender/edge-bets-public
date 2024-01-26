//Run initSportsData as part of installation on production server to populate database with data for tables "teams" and "schedule"

require('dotenv').config();

const axios = require('axios');
const mysql = require('mysql2');
const knex = require('knex')(JSON.parse(process.env.KNEX));


async function getTeams() {
    
    let parsedResult = [];
    const result = await axios.get("https://api.sportradar.us/nfl/official/trial/v7/en/league/hierarchy.json?api_key=" + process.env.API_KEY);
    
    //TODO: REFACTOR FOR NEW API KEY (ESPN?)
    //get team alias (primary key for database), and team name
    for(let i = 0; i < 2; i++){ //2 conferences in NFL
        for(let j = 0; j < 4; j++){ //4 divisions
            for (let k = 0; k < 4; k++ ){ //4 teams per division
                
                const alias = result.data.conferences[i].divisions[j].teams[k].alias //alias is 3 letter (eg. DEN for Denver Broncos), used as primary key for db
                const team_name = result.data.conferences[i].divisions[j].teams[k].market + ' ' + result.data.conferences[i].divisions[j].teams[k].name; //market is city or region (eg. Denver) and name is team name (eg. Broncos)
                const entry = { 'alias': alias, 'team_name': team_name};

                parsedResult.push(entry);
            }
        }
    }
    return parsedResult;
};

async function getGameSchedule(){
    
    //Change year 2022 to current year and REG to PRE or POST depending on season
    
    const {data} = await axios.get("https://api.mysportsfeeds.com/v2.1/pull/nfl/2023-2024-regular/games.json", 
    {
        headers: {
            'Authorization': `Basic ${process.env.NEW_API}`
        }
    });
    
    //get game_id, home, away, game_time for database "game_schedule" table
    let parsedResult = [];
    for (game of data.games) {
        let season = process.env.SEASON;
        let week = game.schedule.week;
        let gameID = game.schedule.id.toString();
        let homeAlias = game.schedule.homeTeam.abbreviation;
        let awayAlias = game.schedule.awayTeam.abbreviation;
        let gameTime = game.schedule.startTime.slice(0, -1);

        let entry = {season: season, nfl_week: week, game_id: gameID, home: homeAlias, away: awayAlias, game_time: gameTime};
        parsedResult.push(entry);
    }
       
    return parsedResult;
    

};

async function initSportsData(){
    // const teams = await getTeams();
    // await knex('teams').insert(teams)
    //     .then((res) => { console.log(teams) });

    setTimeout(() => {}, 1000);
    const schedule = await getGameSchedule();
    await knex('game_schedule').insert(schedule)
        .then((res) => {
            console.dir(schedule, {'maxArrayLength': null}); 
        });

    knex.destroy();
}

module.exports = initSportsData;