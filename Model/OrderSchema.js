import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.ObjectId,
            ref: "Product"
        },
        ProductQantity: {
            type: Number,
            default: 1
        }
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    }
}, { timestamps: true });

const OrderModel = mongoose.model("Order", OrderSchema)

export default OrderModel;