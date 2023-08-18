import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    slug: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: {
        type: String,
        default: "N/A"
    },
    availability: {
        type: String,
        default: 'In Stock',
        enum: ['Out Of Stock', 'In Stock']
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    description: {
        type: [String],
        default: "N/A"
    },
    tag: {
        type: [String],
        default: "N/A"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", ProductSchema)

export default ProductModel;