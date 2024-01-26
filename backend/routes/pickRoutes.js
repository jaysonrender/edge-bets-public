//sets URLs for any HTTP request method to backend API
//pickRoutes handles requests for league, game, and user score data

const express = require('express');
const createConnection = require('../database/dbConnect');
const { submitPick, 
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
        deletePick } = require('../controllers/picksController');
const requireAuth = require('../middleware/requireAuth');

const fs = require('fs');
const router = express.Router();

//require authorization for all pick/game related routes
router.use(requireAuth);

//HTTP GET requests

//TODO: Incorporate season into URLs and respective controller functions
router.get('/games/:pickWeek', getGamesByWeek);
router.get('/games/times/:week', getGameTimesByWeek);
router.get('/getAllGameTimes', getAllGameTimes);
router.get('/scoreboard/:leagueID', getAllPlayersPicksAndScores);
router.get('/userPicks/:userID/:week?', getUserPicks); 
router.get('/picksRemaining/:userID', getRemainingPicksByUser); 
router.get('/stats/:leagueID/:userID', getUserStats);
router.get('/account/:leagueID/:userID', getAccountInfo);
router.get('/leagueLeaders/:leagueID', getLeagueLeaders);
router.get('/leagueRoster/:leagueID', getAllUsersByLeague);

//POST restquests
router.post('/submitPick', submitPick);
router.post('/user/edit-info', editUserInfo);
router.post('/editPaidStatus', editPaidStatus);

router.delete('/', (req, res) => {
    //TODO: api route for deleting picks from database
    res.json({mssg: 'DELETE request'})
});

router.delete('/deletePick/:userID/:pickWeek/:pick/:flexPickStatus', deletePick);

//PATCH requests
//router.patch('/editPick', editPick);

module.exports = router;