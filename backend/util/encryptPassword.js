const crypto = require('crypto');

const encryptPassword = (password) => {
    const hash = crypto.createHash('sha256');
    hash.write(password);
    return hash.digest('hex');
    
};

module.exports = encryptPassword;