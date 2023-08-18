import dotenv from 'dotenv'
dotenv.config({ path: './Backend/.env' });
import * as nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    service: "gmail",
    debug: true,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,   //587
    secure: false, // true for 465, false for other ports
    secureConnection: false,
    auth: {
        user: process.env.EMAIL_USER,   // email of admin
        pass: process.env.EMAIL_PASS // password of admin gmail
    },
    tls: {
        rejectUnAuthorized: true
    },
    socketTimeout: 120000,
    connectionTimeout: 120000

})

export default transporter