require('dotenv').config({ path: '../.env' });
const createConnection = require('../dbConnect');
const fs = require('fs');
const getCurrentWeek = require('../../util/getCurrentWeek')

//run this script on tuesday after week


async function setAutoPicks(week) {

    const db = await createConnection();
    const noPicksQuery = fs.readFileSync('../queries/getUsersNoPicks.sql', 'utf8');
    const onePickQuery = fs.readFileSync('../queries/getUsersOnePick.sql', 'utf8');

    let usersNoPicks;
    let usersOnePick;

    try {
        [usersNoPicks] = await db.execute(noPicksQuery, [process.env.SEASON, week], (error, row, field) => {
            if (error)
                throw error;
        });
        db.unprepare(noPicksQuery);
        [usersOnePick] = await db.execute(onePickQuery, [process.env.SEASON, week], (error, row, field) => {
            if (error)
                throw error;
        });
        db.unprepare(onePickQuery);


    } catch (error) {
        console.log(error)
    }

    console.log(usersNoPicks);
    console.log(usersOnePick);


    const remainingPicksQuery = fs.readFileSync('../queries/getRemainingPicksByUser.sql', 'utf8');
    const autoPickNoPicksQuery = fs.readFileSync('../queries/insertAutoPickNoPicks.sql', 'utf8');

    for (user of usersNoPicks) {
        //get remaining picks
        let remainingPicks;
        try {
            [remainingPicks] = await db.execute(remainingPicksQuery, [user.user_id, process.env.SEASON, user.user_id, process.env.SEASON], (error, row, field) => {
                if (error)
                    throw error;
            });


        } catch (error) {
            console.log(error)
        }
        let remainingPick1, remainingPick2;

        if (remainingPicks.length >= 2) {
            remainingPick1 = remainingPicks[0].alias;
            remainingPick2 = remainingPicks[remainingPicks.length - 1].alias
        } else if (remainingPicks.length === 1) {
            remainingPick1 = remainingPicks[0].alias;
            remainingPick2 = 'ARI';
        } else {
            remainingPick1 = 'ARI';
            remainingPick2 = 'WAS';
        }
        
        //select first and last
        try {
            await db.execute(autoPickNoPicksQuery, [process.env.SEASON, user.user_id, week, remainingPick1, remainingPick2], (error, row, field) => {
                if (error)
                    throw error;
            });
        } catch (error) {
            console.log(error)
        } finally {
            console.log('success auto_pick = 2');
        }

    }
    db.unprepare(autoPickNoPicksQuery);

    const autoPickOnePickQuery = fs.readFileSync('../queries/insertAutoPickOnePick.sql', 'utf8')

    for (user of usersOnePick) {
        let remainingPicks;


        try {
            [remainingPicks] = await db.execute(remainingPicksQuery, [user.user_id, process.env.SEASON, user.user_id, process.env.SEASON], (error, row, field) => {
                if (error)
                    throw error;
            });


        } catch (error) {
            console.log(error)
        } finally {

        }
        
        let remainingPick2;
        if (remainingPicks.length >= 1){
            remainingPick2 = remainingPicks[0].alias;
        } else {
            remainingPick2 = 'ARI';
        }
        
        try {
            await db.execute(autoPickOnePickQuery, [remainingPick2, user.user_id, process.env.SEASON, week], (error, row, field) => {
                if (error)
                    throw error;
            });
        } catch (error) {
            fs.writeFile(`../log/autoPickLogWeek${getCurrentWeek(new Date() - 1)}ERROR.txt`, JSON.stringify({ "ERROR DATE": new Date(), "data": error.message }));
            console.log(error);
        } finally {
            console.log('success auto_pick = 1');
        }
    }
    db.unprepare(autoPickOnePickQuery);
    await db.end();

    fs.writeFileSync(`../log/autoPickLogWeek${getCurrentWeek(new Date()) - 1}.txt`, JSON.stringify({ "Date Updated": new Date(), "data": [...usersNoPicks, ...usersOnePick] }, { 'flag': 'w' }))

}


// uncomment this line when season is underway
// setAutoPicks(getCurrentWeek(new Date()) - 1);

setAutoPicks(getCurrentWeek(new Date()) - 1);