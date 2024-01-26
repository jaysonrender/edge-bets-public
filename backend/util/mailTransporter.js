const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: 'true',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = transporter;
