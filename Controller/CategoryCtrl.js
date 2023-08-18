import CategoryModel from "../Model/CategorySchema.js";
import slugify from 'slugify'

export async function AddCategory(req, res) {
    try {
        if (req.body.name) {
            const Result = await CategoryModel.findOne({ name: req.body.name });
            if (!Result) {
                const Data = await CategoryModel.create({
                    name: req.body.name,
                    slug: slugify(req.body.name)
                });
                await Data.save();
                res.status(201).send({ 'status': "Pass", 'message': "The Category Added Successfully...!", Category: Data });
            } else {
                res.send({ 'status': "Fail", 'message': "The Category is Already Present." });
            }
        } else {
            res.send({ 'status': "Fail", 'message': "All fields are Required." });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.', error })
    }
}

export async function UpdateCategory(req, res) {
    try {
        if (req.body.name) {
            const CheckNewAddedExist = await CategoryModel.findOne({ name: req.body.name });
            if (!CheckNewAddedExist) {
                await CategoryModel.findByIdAndUpdate(
                    req.params.id, { name: req.body.name, slug: slugify(req.body.name) }, { new: true }
                );
                res.status(201).send({ 'status': "Pass", 'message': "The Category Updated Successfully...!" });
            } else {
                res.send({ 'status': "Fail", 'message': "This Category is Already Present." });
            }
        } else {
            res.send({ 'status': "Fail", 'message': "All fields are Required." });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.', error })
    }
}

export async function GetAllCategory(req, res) {
    try {
        const AllCategory = await CategoryModel.find();
        res.send({ 'status': "Pass", 'message': "Categorys Displayed successfully", categories: AllCategory });
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.', error })
    }
}

export async function GetSingleCategory(req, res) {
    try {

        const SingleCategory = await CategoryModel.findOne({ slug: req.params.slug });
        if (SingleCategory) {
            res.send({ 'status': "Pass", 'message': "Categorys Displayed successfully", category: SingleCategory });
        } else {
            res.send({ 'status': "Fail", 'message': "This Category is Not present." });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.', error })
    }
}

export async function DeleteCategory(req, res) {
    try {
        const Category = await CategoryModel.findById(req.params.id)
        if (Category) {
            const DeleteCategory = await CategoryModel.deleteOne(Category);
            res.send({ 'status': "Pass", 'message': "The Category Deleted Successfully...!", DeleteCategory });
        } else {
            res.send({ 'status': "Fail", 'message': "This Category is Not present." });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Server is Down, Please try later.', error })
    }
}