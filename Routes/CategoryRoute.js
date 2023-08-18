import express from 'express';
import { requireSignIn, isAdmin } from '../Middleware/auth-middleware.js';
import { AddCategory, UpdateCategory, DeleteCategory, GetAllCategory, GetSingleCategory } from '../Controller/CategoryCtrl.js';

const route = express.Router();

route.post('/create-category', requireSignIn, isAdmin, AddCategory);
route.put('/update-category/:id', requireSignIn, isAdmin, UpdateCategory);
route.delete('/delete-category/:id', requireSignIn, isAdmin, DeleteCategory);

route.get('/showall-category', GetAllCategory);
route.get('/single-category/:slug', GetSingleCategory);


export default route;