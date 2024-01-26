//sets URLs for any HTTP request method to backend API
//userRoutes handles requests involving user login/signup and creating a league

const express = require('express');

const { loginUser, 
        joinLeague, 
        createLeague,
        forgotPassword,
        getUserInfo,
        resetPassword,
        handleResetPassword,
        submitFeedback } = require('../controllers/userController');

const router = express.Router();

//login
router.post('/login', loginUser); 
//signup
router.post('/join-league', joinLeague); 
//create a league
router.post('/create-league', createLeague);


router.post('/forgot-password', forgotPassword);

router.get('/user-info/:userID', getUserInfo);


router.post('/reset-password', resetPassword);

router.post('/submit-feedback', submitFeedback);

//DELETE methods
//TODO:
//  deleteUser
//  resetPassword

module.exports = router;