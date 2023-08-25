import UserModel from "../Model/UserSchema.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({ path: './Backend/.env' });
import transporter from "../Config/EmailConfig.js";
import bcrypt from 'bcrypt'

export async function SendUserPasswordResetEmail(req, res) {
    try {
        if (req.body.email) {
            const user = await UserModel.findOne({ email: req.body.email.toLowerCase() });
            if (user) {
                const secert = user?._id + process.env.SECRET_KEY
                const token = jwt.sign({ userID: user?._id }, secert, { expiresIn: '5m' })

                const link = `https://mytechhub.netlify.app/reset-password/${token}` // Here the Host is the React Host

                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user?.email,
                    subject: "Password Rest Link",
                    html: `<html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            .container{
                                height: 200px;
                                width: 1000px;
                            }
                            .card {
                                background-image: linear-gradient(to top, rgb(255, 255, 255), rgb(211, 216, 222), rgb(255, 255, 255));
                                margin: 50px;
                                padding: 30px;
                                border: solid gray 3px;
                                box-shadow: inset -2px -1px 8px 1px gray;
                                border-radius: 25px;
                            }
                            .title {
                                font-family: Georgia, 'Times New Roman', Times, serif;
                            }
                            h1 a {
                                font-family: Georgia, 'Times New Roman', Times, serif;
                            }
                        </style> 
                    </head>
                    <body>
                        <div class="container">
                            <div class="card">
                                <div class="title">
                                    <h1>Click Below to Reset Password</h1>
                                    <h3><a href="${link}">..Reset Password</a></h3>
                                </div>
                            </div>
                        </div>
                    </body>  
                    </html>`
                })
                res.send({ "status": "Pass", "message": "Password reset link send successfully.", "Reset Link": link })
            }
            else {
                res.send({ "status": "Fail", "message": "You are not Registered." })
            }
        } else {
            res.send({ "status": "Fail", "message": "All Fields are required." })
        }
    } catch (error) {
        res.send({ "status": "Fail", "message": "Server is Down." });
    }
}

export async function ResetPassword(req, res) { //Forgot Password
    try {

        const UserIDFromToken = jwt.decode(req.params.token).userID
        const user = await UserModel.findById(UserIDFromToken);
        const new_secret = user._id + process.env.SECRET_KEY;

        if (req.body.password && req.body.confirm_pass) {
            if (req.body.password === req.body.confirm_pass) {
                jwt.verify(req.params.token, new_secret)                        // Verify the token and new_Secret key is same or not 
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);
                await UserModel.findByIdAndUpdate(user._id, { $set: { password: hashPassword } })
                res.send({ "status": "Pass", "message": "Password Reset Succssfully..!" })
            } else {
                res.send({ "status": "Fail", "message": "Password and Confirm password not match" })
            }
        } else {
            res.send({ "status": "Fail", "message": "Both fields are require to reset the password" })
        }
    } catch (error) {
        res.send({ "status": "Fail", "message": "Unauthorized user" })
    }

}