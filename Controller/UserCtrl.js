import UserModel from "../Model/UserSchema.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

async function UserRegistration(req, res) {
    try {
        const { name, phone, email, password, role } = req.body
        if (name && phone && email && password && role) {
            if (phone.length === 10) {
                const isExistingUser = await UserModel.findOne({ email: email.toLowerCase() });
                if (!isExistingUser) {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    const user = await UserModel.create({
                        name: name.toUpperCase(),
                        email: email.toLowerCase(),
                        role,
                        password: hashPassword,
                        phone: ("+91" + phone)
                    })
                    await user.save();
                    res.status(201).send({ "status": "Pass", "message": "SignUp Successfully.", user })
                }
                else {
                    res.send({ 'status': "Fail", 'message': "You Are Already Registered." });
                }
            } else {
                res.send({ 'status': "Fail", 'message': "Please Enter 10 Digit Mobile Number" });
            }
        }
        else {
            res.send({ 'status': "Fail", 'message': "All Fields Required." });
        }
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' })
    }
}

async function UserLogin(req, res) {
    try {
        if (req.body.email && req.body.password) {
            const User = await UserModel.findOne({ email: req.body.email.toLowerCase() });
            if (User) {
                const CheckPassword = await bcrypt.compare(req.body.password, User.password);
                if (CheckPassword) {
                    const token = jwt.sign({ UserID: User._id }, process.env.JWT_SECRETKEY, { expiresIn: "5d" });
                    res.send({
                        "status": "Pass", "message": "Login Successfull..!",
                        "user": { name: User.name, UserID: User?._id, email: User.email, address: User.address, phone: User.phone, role: User.role }, token
                    })
                } else {
                    res.send({ 'status': "Fail", 'message': "Invalid Password." });
                }
            }
            else {
                res.send({ 'status': "Fail", 'message': "You Are Not Registered." });
            }
        }
        else {
            res.send({ 'status': "Fail", 'message': "All Fields Required." });
        }
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' })
    }
}

async function AdminLogin(req, res) {
    try {
        res.send({ status: "Pass", message: "Your are Admin" });
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' })
    }
}

async function LogedUser(req, res) { // Middleware required
    try {
        res.send({ "status": "Pass", "message": "You are Loged In" })
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' });
    }
}

async function UpdateUserDetails(req, res) {
    try {
        const { name, address, email, phone } = req.body
        const NewDetails = {};
        if (name) { NewDetails.name = name };
        if (address) { NewDetails.address = address };
        if (phone) { NewDetails.phone = phone };

        if (NewDetails.phone.length === 13) {
            const Result = await UserModel.findOneAndUpdate({ email }, { $set: NewDetails }, { new: true })
            res.send({
                status: "Pass", message: "Your Profile Updated Successfully.",
                user: { name: Result.name, UserID: Result?._id, email: Result.email, address: Result.address, phone: Result.phone, role: Result.role },
            });
        } else {
            res.send({ 'status': "Fail", 'message': "Please Enter Correct Mobile Number" });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' });
    }
}

async function ChangePassword(req, res) {
    try {
        const { password, confirm_pass } = req.body
        if (password && confirm_pass) {
            if (password === confirm_pass) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                await UserModel.findOneAndUpdate({ email: req.user.email }, { $set: { password: hashPassword } });
                res.send({ status: "Pass", message: "Password Change Successfully." })
            } else {
                res.send({ status: 'Fail', message: 'Password And Confirm Password Not Match' })
            }
        } else {
            res.send({ status: 'Fail', message: 'Both Fields Required' })
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' });
    }
}

async function GetAllUsers(req, res) {
    try {
        const Result = await UserModel.find()
        res.send({ status: "Pass", message: "Users List Fetch Successfully..", users: Result })
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' });
    }
}

async function DeleteUser(req, res) {
    try {
        const { userId } = req.body
        if (userId) {
            await UserModel.findByIdAndDelete(userId);
            res.send({ status: "Pass", message: "User Deleted Successfully" });
        } else {
            res.send({ status: 'Fail', message: "Could Not Found User Id" });
        }
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.' });
    }
}


export { UserRegistration, UserLogin, AdminLogin, LogedUser, UpdateUserDetails, ChangePassword, GetAllUsers, DeleteUser }