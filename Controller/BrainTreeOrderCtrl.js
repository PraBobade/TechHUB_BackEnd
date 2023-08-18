
import dotenv from 'dotenv';
dotenv.config();
import braintree from 'braintree';
import OrderModel from '../Model/OrderSchema.js';
import ProductModel from '../Model/ProductSchema.js'

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
});

export async function BraintreeTokenPayment(req, res) {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) res.send({ status: 'Fail', message: 'Fail to Generate Token', error: err.message })
            else res.send({ status: 'Pass', message: 'Token Get successfully', response })
        })
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Braintree Token Payment Functionality', error })
    }
}

export async function PaymentByCard(req, res) {
    try {
        const { cart, nonce } = req.body
        let total = 0;
        const ProductID = cart.map((item) => item._id);
        cart.map((item) => { total += item.price * item.quantity; });

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: { submitForSettlement: true }
        },
            async function (error, result) {
                if (result) {
                    const order = new OrderModel({
                        products: ProductID,
                        buyer: req.user._id,
                        payment: result,
                        amount: total
                    });
                    await order.save();
                    res.json({ ok: true, order });
                } else {
                    res.send({ status: 'Fail', error: error.message })
                }
            }
        )
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Braintree Payment Functionality', error })
    }
}

export async function PaymentByCOD(req, res) {
    try {
        const { cart } = req.body
        let total = 0;
        cart.map((item) => { total += item.price * item.quantity; });
        const dataArray = cart.map(item => ({
            product: item._id,
            ProductQantity: item.quantity
        }));


        const order = new OrderModel({
            products: dataArray,
            payment: { PaymentMode: "Cash On Delivery" },
            buyer: req.user._id,
            amount: total
        });
        await order.save();
        res.json({ ok: true, order });
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Payment in Cash On Delivery', error })
    }

}

export async function GetAllUsersOrders(req, res) {
    try {
        const allUsersOrders = await OrderModel.find({ buyer: req.user._id }).select('-payment').populate('products.product', '-photo').populate("buyer", "name");
        res.send({ status: 'Pass', message: 'Order Fetch Successfully', length: allUsersOrders.length, orders: allUsersOrders })
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Fetching All Users Orders Functionality', error })
    }
}

export async function GetAllOrders(req, res) {
    try {
        const AllOrders = await OrderModel.find().select('-payment').populate('products.product', '-photo').populate("buyer", "name");
        res.send({ status: "Pass", message: "All Orders Fetch Successfully", length: AllOrders.length, orders: AllOrders })
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Fetching All Orders Functionality', error })
    }
}

export async function FilterOrders(req, res) {
    try {
        let filteredOrders = [];
        const { status, category } = req.body;
        const filter = {};
        if (status && status.length > 0) filter.status = status
        const orders = await OrderModel.find(filter).select('-payment').populate('products.product', '-photo').populate("buyer", "name");
        if (category && category.length > 0) {
            for (const order of orders) {
                const productIds = order.products.map(item => item.product);
                const products = await ProductModel.find({ _id: { $in: productIds } }).select('-photo -description').populate('category');
                if (products.some(product => product.category.name === category)) {
                    filteredOrders.push(order);
                }
            }
        } else {
            for (const order of orders) {
                filteredOrders.push(order);
            }
        }
        res.send({ status: "Pass", message: "All Orders Fetch Successfully", length: filteredOrders.length, orders: filteredOrders })

    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Fetching All Orders Functionality', error })
    }
}

export async function SetOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (orderId && status) {
            const UpdateStatus = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
            res.send({ status: "Pass", message: "The Status Updated Successfully", order: UpdateStatus });
        } else {
            res.send({ status: "Fail", message: "OrderId or Updated Status NOT found." })
        }
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Setting Order Status Functionality', error })
    }
}

export async function CancelOrder(req, res) {
    try {
        const { orderId } = req.params;
        if (orderId) {
            const UpdateStatus = await OrderModel.findByIdAndUpdate(orderId, { status: "Cancelled" }, { new: true });
            res.send({ status: "Pass", message: "The Order Cancelled Successfully", order: UpdateStatus });
        } else {
            res.send({ status: "Fail", message: "OrderId NOT found." })
        }
    } catch (error) {

        res.send({ 'status': 'Fail', 'message': 'Error in Setting Order Status Functionality', error })
    }
}

export async function DeleteOrder(req, res) {
    try {
        await OrderModel.findByIdAndDelete(req.params.id)
        res.status(201).send({ 'status': "Pass", 'message': "The Order Deleted Successfully...!" });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Delete Order Functionality', error: error.message })
    }
}