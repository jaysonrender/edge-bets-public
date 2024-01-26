const createConnection = require('../database/dbConnect');
const fs = require('fs');
const generateLeagueCode = require('../util/generateLeagueCode');
const encryptPassword = require('../util/encryptPassword');
const validator = require('validator');
const createToken = require('../util/generateJWT');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//utility function for loginUser
async function validateUser(username, password) {
    const db = await createConnection();

    const values = [username, password, username, password]; //fields for prepared statement in query

    const query = fs.readFileSync('./database/queries/validateUsernameAndPassword.sql', 'utf8');

    try {
        const [result] = await db.execute(query, values, (error, result, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(query);
        db.end();

        if (result.length === 1)
            return result[0];

        else if (result.length === 0) {
            return { errorMessage: "Incorrect Username or Password." };
        }
        else {
            return { errorMessage: "Something went wrong." }
        }
    }
    catch (error) {
        return { errorMessage: error.message };
    } finally {
        await db.end();
    }

}

async function setLeagueAdmin(username, leagueID) {

    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/setLeagueAdmin.sql', 'utf8')
    try {
        db.execute(query, [username, leagueID], (error, result, field) => {
            if (error) {
                console.log(error);
            }
        });

        db.unprepare(query);

    } catch (error) {
        console.log(error);
    } finally {
        await db.end();
    }
}


async function loginUser(request, response) {
    const { username, password } = request.body;

    //if username or password fields aren't filled
    if (Object.values(request.body).includes("") || Object.values(request.body).includes(null)) {
        response.status(400).json({ message: "All fields must be filled" });
    } else {
        //SHA-256 encryption
        const passwordHash = encryptPassword(password);
        const user = await validateUser(username, passwordHash);
        
        if (user.user_id) {

            //JSON Web Token will be used to authenticate users in frontend
            const token = createToken(user.league_id, user.user_id);
            const db = await createConnection();

            try {
                //get leagueName to add to UserContext in frontend
                const getLeagueByID = fs.readFileSync('./database/queries/getLeagueByID.sql', 'utf8');
                const [result] = await db.execute(getLeagueByID, [user.league_id], (error, result, field) => {
                    if (error) console.log(error);
                });
                const leagueName = result[0].league_name;
                //this information is kept in the UserContext that React uses throughout components in frontend
                const userContext = { leagueID: user.league_id, userID: user.user_id, leagueName: leagueName, username: user.username, userType:user.user_type, userToken: token, message: "Successful login" };
                response.status(200).json(userContext);

            } catch (error) {
                response.status(400).json({ error: error, message: error.message });
            } finally {
                await db.end();
            }
        }
        else { response.status(400).json({ message: user.errorMessage }) }

    }

};

async function joinLeague(request, response) {

    const { leagueID, fname, lname, username, password, email, userType } = request.body;

    const db = await createConnection();

    //validate information (league_id, email, and strong password) first
    if (Object.values(request.body).includes("")) {
        response.status(400).json({ errorMessage: "empty-fields", message: "All fields must be filled" });
    }
    else if (!validator.isEmail(email)) {
        response.status(400).json({ errorMessage: "invalid-email", message: "Email is not valid." });
    }
    else if (!validator.isStrongPassword(password)) {
        response.status(400).json({ errorMessage: "invalid-password", message: "Password is not strong enough" });
    }
    else if (leagueID.length !== 6) {
        response.status(400).json({ errorMessage: "invalid-leagueID", message: "League ID invalid, must be 6 characters" });
    }

    else { //if information given is valid

        //get existing username and email info to make sure user doesn't already exist
        const getUsersQuery = fs.readFileSync('./database/queries/getEmailAndUsernames.sql', 'utf8');
        const [userResults] = await db.execute(getUsersQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(getUsersQuery);

        //get league information to make sure league exists before adding user to the league
        const getLeaguesQuery = fs.readFileSync('./database/queries/getLeagues.sql', 'utf8');
        const [leagueResults] = await db.execute(getLeaguesQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });
        //compare what new user gave vs database
        if (userResults.some((element) => username === element.username || email === element.email)) {
            response.status(400).json({ errorMessage: "user-already-exists", message: "User already exists with this username and/or email" });
        }
        else if (!leagueResults.some((element) => leagueID === element.league_id)) {
            response.status(400).json({ errorMessage: "league-not-exist", message: "Invalid League ID, league does not exist" });
        }

        //if username/email is available and league exists
        else {

            const setQuery = fs.readFileSync('./database/queries/addUser.sql', 'utf8');
            const getLeagueByID = fs.readFileSync('./database/queries/getLeagueByID.sql', 'utf8');
            const values = [leagueID, fname, lname, username, encryptPassword(password), email, userType];
            try {
                const [result] = await db.execute(setQuery, values, (error, result, field) => {
                    if (error) console.log(error);
                });

                db.unprepare(setQuery);
                if (userType === 'admin') {
                    setLeagueAdmin(username, leagueID);
                }

                const [leagueResult] = await db.execute(getLeagueByID, [leagueID], (error, result, field) => {
                    if (error) console.log(error);
                });

                const leagueName = leagueResult.league_name;
                const userID = result.insertId;

                //JSON Web Token will be used to authenticate users in frontend
                const token = createToken(leagueID, userID);
                response.status(200).json({ leagueID: leagueID, userID: userID, leagueName: leagueName, username: username, userType: userType, userToken: token, message: 'User Successfully Joined!' });
            } catch (error) {
                response.status(400).json({ error: error, message: error.message });
            } finally {
                await db.end();
            }
        }
    }
};

async function createLeague(request, response) {

    const { leagueName } = request.body;
    if (leagueName !== null && leagueName !== "") {
        const db = await createConnection();

        //get league IDs to check if league already exists
        const getQuery = fs.readFileSync('./database/queries/getLeagues.sql', 'utf8');
        const [leagueResults] = await db.execute(getQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });

        db.unprepare(getQuery);


        if (leagueResults.some((element) => leagueName === element.league_name)) {
            response.status(400).json({ teamExists: true, message: "League already exists with this name" })
        } else {
            const setQuery = fs.readFileSync('./database/queries/addLeague.sql', 'utf8');

            let leagueID = generateLeagueCode(); //generates random 6-character code
            while (leagueResults.some((element) => leagueID === element.league_id)) //if the random code generated is already used in the database, generate a new one.
                leagueID = generateLeagueCode();

            try {
                const [result, fields] = await db.execute(setQuery, [leagueID, leagueName], (error) => {
                    if (error)
                        console.log(error);
                });
                db.unprepare(setQuery);


                response.status(200).json({ message: 'Created a League!', leagueID: leagueID, result: result });
            } catch (error) {
                res.status(400).json({ errorMessage: error });
            } finally {
                await db.end();
            }
        }
    } else {
        response.status(400).json({ errorMessage: "empty-fields", message: "All fields must be filled" });
    }

};

async function getUserInfo(request, response){
    const {userID} = request.params;
    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/getUserPassHash.sql', 'utf8');

    try{
        const [result] = await db.execute(query, [userID],
        (error, row, fields) =>{
            if(error) response.status(400).json({errorMessage: error.message})
        });
        if (result.length === 0) {
            response.status(400).json({errorMessage: 'No account found with this user_id'});
            return;
        } else {
            response.status(200).json({user: result[0], errorMessage: 'Success'});
        }
    } catch (error) {
        response.status(400).json({errorMessage: error.message})
    } finally {
        await db.end();
    }

}

async function forgotPassword(request, response) {
    const {email} = request.body;
    //get email from database
    const db = await createConnection();
    
    try {
        const query = fs.readFileSync('./database/queries/getUserByEmail.sql', 'utf8');
        const [result] = await db.execute(query, [email], (error, row, fields) =>{
            if(error) response.status(400).json({errorMessage: error.message})
        });
        if (result.length === 0) {
            response.status(400).json({errorMessage: 'No account found with that email'});
            return;
        } else {
            //generate jwt
            const pwSecret = process.env.JWT_SECRET + result[0].password_hash;
            const payload = {userID: result[0].user_id, email: result[0].email }
            const token = jwt.sign(payload, pwSecret, {expiresIn: '15m'})
            //TODO: Replace localhost with edge-bets.com after testing
            const link = `http://www.edge-bets.com/reset-password/${payload.userID}/${token}`
            // const link = `http://localhost:3000/reset-password/${payload.userID}/${token}`;

            const transporter = require('../util/mailTransporter');

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Edge Bets Password Reset Request',
                html: 
                    `<p>Hello ${result[0].fname},</p>
                     <br />
                     <p>Please click the link below to reset the password for your Edge Bets account. </p>
                     <p>If clicking the link doesn't work, copy and paste the link into the address bar of your browser.</p>
                     <br />
                     <p>Password Reset Link: <a href="${link}">${link}</a> </p>
                     <br />
                     <p>This link is only valid for 15 minutes.</p>
                     <br />
                     <p>If you have any further issues or did not request this password reset, please contact us at nflpickemco@gmail.com or ${process.env.EMAIL}.</p>
                     <br />
                     <p>Thank you, </p>
                     <p>Edge Bets </p>
                `
            }
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
               console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  
                }
              });

            response.status(200).json({link: link, errorMessage: 'A link to reset your password has been sent to your email'})
        }
    } catch (error) {
        response.status(400).json({errorMessage: error.message})
    } finally {
        await db.end();
    }
    
    
    
    
    //use nodemailer to send email
    //response 
}

async function resetPassword(request, response) {
    const {userID, password} = request.body;
    const db = await createConnection();

    const newPasswordHash = encryptPassword(password);
    const findUserQuery = fs.readFileSync('./database/queries/getUserPassHash.sql', 'utf8');
    const updatePWQuery = fs.readFileSync('./database/queries/changePassword.sql', 'utf8');
    
    try{
        const [result] = await db.execute(findUserQuery, [userID], (error, row, fields) =>{
            if(error) response.status(400).json({errorMessage: error.message})
        });
        if (result.length === 0) {
            response.status(400).json({errorMessage: 'No user found with user_id associated with password reset link'})
        }
        db.unprepare(findUserQuery);

        await db.execute(updatePWQuery, [newPasswordHash, userID], (error, row, fields) =>{
            if(error) response.status(400).json({errorMessage: error.message})
        });
        await db.unprepare(updatePWQuery);

        response.status(200).json({errorMessage: 'Password Reset. Returning to log in page...'})
    } catch (error) {
        response.status(400).json({errorMessage: error.message})
    } finally {
       await db.end();
    }
}
async function handleResetPassword(request, response) {}

async function submitFeedback(request, response) {
    const {name, email, subject, message} = request.body;

    const transporter = require('../util/mailTransporter');

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Edge Bets User Issue/Feedback - Subject: ${subject}`,
        html: `<p>Issue Submitted By User </p>
               <br />
               <p><strong>From: </strong> ${name}</p>
               <p><strong>Email: </strong> ${email}</p>
               <br />
               <p><strong>Message: </strong>${message}</p>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          
        }
      });

      response.status(200).json({errorMessage: 'Your feedback/issue has been submitted.'})
}


module.exports = { 
    loginUser, 
    joinLeague, 
    createLeague, 
    forgotPassword,
    getUserInfo,
    resetPassword,
    handleResetPassword,
    submitFeedback};