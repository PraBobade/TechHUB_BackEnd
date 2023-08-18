import express from 'express';
import { requireSignIn, isAdmin } from '../Middleware/auth-middleware.js';
import { BraintreeTokenPayment, PaymentByCard, GetAllUsersOrders, GetAllOrders, FilterOrders, SetOrderStatus, DeleteOrder, CancelOrder, PaymentByCOD } from '../Controller/BrainTreeOrderCtrl.js'


const route = express.Router();

route.get('/braintree/token', BraintreeTokenPayment)
route.post('/braintree/payment', requireSignIn, PaymentByCard)
route.post('/braintree/cod-payment', requireSignIn, PaymentByCOD)
route.get('/orders/all-user-orders', requireSignIn, GetAllUsersOrders);
route.put('/orders/cancel-UserOrder/:orderId', requireSignIn, CancelOrder);
route.post('/admin/orders/filter-orders', requireSignIn, isAdmin, FilterOrders);
route.delete('/admin/orders/delete-order/:id', requireSignIn, isAdmin, DeleteOrder);
route.get('/admin/orders/all-orders', requireSignIn, isAdmin, GetAllOrders);
route.put('/admin/orders/set-status/:orderId', requireSignIn, isAdmin, SetOrderStatus);
export default route;  