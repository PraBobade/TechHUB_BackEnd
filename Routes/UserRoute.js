import express from 'express';
import { UserRegistration, UserLogin, AdminLogin, LogedUser, UpdateUserDetails, ChangePassword, GetAllUsers, DeleteUser } from '../Controller/UserCtrl.js';
import { requireSignIn, isAdmin } from '../Middleware/auth-middleware.js';
import { SendUserPasswordResetEmail, ResetPassword } from '../Controller/PasswordResetCtrl.js';

const route = express.Router();


route.post('/register', UserRegistration);
route.post('/login', UserLogin);
route.put('/update-user', requireSignIn, UpdateUserDetails)
route.put('/change-password', requireSignIn, ChangePassword)

route.get('/get-all-users', requireSignIn, isAdmin, GetAllUsers);
route.post('/delete-user', requireSignIn, isAdmin, DeleteUser);

// Protected Routes
route.get('/user-auth', requireSignIn, LogedUser);
route.get('/admin-auth', requireSignIn, isAdmin, AdminLogin);


// Forgot Password
route.post('/send-reset-password-link', SendUserPasswordResetEmail);
route.post('/reset-password/:token', ResetPassword);


export default route;