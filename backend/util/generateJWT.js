const jwt = require('jsonwebtoken');


function createToken(leagueID, userID) {
    return jwt.sign({leagueID, userID}, process.env.JWT_SECRET, {expiresIn: '3d'});
}

module.exports = createToken;
