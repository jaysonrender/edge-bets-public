function generateLeagueCode() {
    const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    
    for (let i = 0; i < 6; i++){
        let index = Math.floor(Math.random() * (alphaNum.length - 1));
        code = code.concat(alphaNum[index]);
    }
    
    
    return code;
}

module.exports = generateLeagueCode;