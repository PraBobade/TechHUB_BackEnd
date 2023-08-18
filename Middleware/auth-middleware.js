import jwt from "jsonwebtoken"
import UserModel from "../Model/UserSchema.js"

async function requireSignIn(req, res, next) { // With out login we didnt get authToken so no need to check password 
    try {
        let token;
        const { authorization } = await req.headers
        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
            try {// if token and secrete key is not match this will direct throw an error so we are using the two try and catch methods here.
                const { UserID } = jwt.verify(token, process.env.JWT_SECRETKEY);
                req.user = await UserModel.findById(UserID);
                if (req.user !== null) {
                    next();
                } else {
                    res.send({ "status": "Fail", "message": "No user is Found." })
                }
            } catch (error) {
                res.send({ "status": "Fail", "message": error.message })
            }
        } else if (!token) {
            res.send({ "status": "Fail", "message": "No token Available" })
        }
    } catch (error) {
        res.send({ "status": "Fail", "message": "Server is Down." })
    }
}

async function isAdmin(req, res, next) { // Middleware Required
    try {
        if (req.user.role === 'Admin') {
            next();
        } else {
            res.send({ "status": "Fail", "message": "unAuthorized Access." })
        }
    } catch (error) {
        res.send({ "status": "Fail", "message": "Server is Down." })
    }
}
export { requireSignIn, isAdmin }