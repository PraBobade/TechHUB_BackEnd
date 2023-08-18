import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    }
});

const CategoryModel = mongoose.model("Category", CategorySchema)

export default CategoryModel;