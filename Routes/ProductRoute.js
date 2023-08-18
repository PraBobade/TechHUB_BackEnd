import express from 'express';
import { requireSignIn, isAdmin } from '../Middleware/auth-middleware.js';
import { AddProduct, UpdateProduct, GetAllProduct, DeleteProduct, GetSingleProduct, CategoryProducts, GetProductPhoto, FilterProduct, SearchProduct, RelatedCategoryProduct } from '../Controller/ProductCtrl.js';
import formidable from 'express-formidable'

const route = express.Router();

route.post('/create-product', requireSignIn, isAdmin, formidable(), AddProduct);
route.put('/update-product/:id', requireSignIn, isAdmin, formidable(), UpdateProduct);
route.delete('/delete-product/:id', requireSignIn, isAdmin, DeleteProduct);
route.get('/product-photo/:id', GetProductPhoto);
route.get('/all-product', GetAllProduct);
route.get('/single-product/:slug', GetSingleProduct);

route.get('/getCategoryProducts/:CategoryID', CategoryProducts);
route.post('/filter-product', FilterProduct);
route.get('/related-product/:CategoryID/:ProductID', RelatedCategoryProduct);
route.get('/search/:keyword', SearchProduct);

export default route;