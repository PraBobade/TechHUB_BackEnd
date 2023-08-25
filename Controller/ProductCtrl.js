import ProductModel from "../Model/ProductSchema.js";
import slugify from 'slugify'
import fs from 'fs';


export async function AddProduct(req, res) {
    try {
        const { name, category, price, description, availability, tag, brand, model } = req.fields
        const { photo } = req.files

        if (name && description && price && category && photo && model && tag && availability && brand) {
            if (photo.size > 10000) {
                if (model.length === 10) {
                    const Data = await ProductModel.create({
                        name, category, brand, availability, price, model: model.toUpperCase(),
                        description: JSON.parse(description),
                        tag: JSON.parse(tag),
                        slug: slugify(name),
                        photo: {
                            data: fs.readFileSync(photo.path),
                            contentType: photo.type
                        }
                    });
                    await Data.save();
                    res.status(201).send({ 'status': "Pass", 'message': "The Product Added Successfully...!", product: Data });
                } else {
                    res.send({ 'status': "Fail", 'message': "Please Enter Correct Model Name" });
                }
            } else {
                res.send({ 'status': "Fail", 'message': "The Photo size should be below 10Mb." });
            }
        } else {
            res.send({ 'status': "Fail", 'message': "All fields are Required." });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Adding in New Product.', error: error.message })
    }
}

export async function UpdateProduct(req, res) {
    try {
        const { name, description, price, availability, category, model, brand, tag } = req.fields
        const { photo } = req.files

        const NewUpdatedProduct = {}
        if (name) NewUpdatedProduct.name = name;
        if (tag) NewUpdatedProduct.tag = JSON.parse(tag);
        NewUpdatedProduct.slug = slugify(name)
        if (description) NewUpdatedProduct.description = JSON.parse(description);
        if (availability) NewUpdatedProduct.availability = availability;
        if (price) NewUpdatedProduct.price = price
        if (brand) NewUpdatedProduct.brand = brand
        if (category) NewUpdatedProduct.category = category
        if (model && model.length === 10) NewUpdatedProduct.model = model.toUpperCase()
        if (photo) NewUpdatedProduct.photo = { data: fs.readFileSync(photo.path), contentType: photo.type }

        const updated = await ProductModel.findByIdAndUpdate(req.params.id, { $set: NewUpdatedProduct }, { new: true })
        res.status(201).send({ 'status': "Pass", 'message': "The Product updated Successfully...!", product: updated });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Updating Product.', error: error.message })
    }
}

export async function GetAllProduct(req, res) {
    try {
        const Result = await ProductModel.find().select('-photo').populate('category');  // with populate all the data in category will shown
        res.status(200).send({ 'status': "Pass", 'message': "Product List Fetch Successfully...!", products: Result });
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Fetching Details of Products.', error: error.message })
    }
}

export async function GetSingleProduct(req, res) {
    try {
        const { slug } = req.params
        const Result = await ProductModel.findOne({ slug }).select('-photo').populate('category');
        res.status(200).send({ 'status': "Pass", 'message': "Product Fetch Successfully...!", product: Result });
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Fetching Single Product.', error: error.message })
    }
}

export async function GetProductPhoto(req, res) {
    try {
        const Result = await ProductModel.findById(req.params.id).select('photo');
        if (Result) {
            res.set("Content-type", Result.photo.contentType);
            res.status(200).send(Result.photo.data);
        } else {
            res.send({ status: "Fail", message: "Photo Not found" });
        }
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Get Product Photo Functionality', error: error.message })
    }
}

export async function DeleteProduct(req, res) {
    try {
        await ProductModel.findByIdAndDelete(req.params.id)
        res.status(201).send({ 'status': "Pass", 'message': "The Product Deleted Successfully...!" });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Delete Product Functionality', error: error.message })
    }
}

export async function FilterProduct(req, res) {
    try {
        const { category, PriceRange, brand, availability, battery, name, model } = req.body;

        const filter = {};
        if (battery && battery.length > 0) filter.description = { $regex: new RegExp(`(${battery[0]}|${parseInt(battery[0].toString()[0])}[0-9]{1,3}|${battery[1]}) mah`, 'i') };
        if (category && category.length > 0) filter.category = category;
        if (availability && availability.length > 0) filter.availability = { $ne: availability };
        if (brand && brand.length > 0) filter.brand = brand;
        if (PriceRange && PriceRange.length > 0) filter.price = { $gte: PriceRange[0], $lte: PriceRange[1] }
        if (name && name.length > 0) filter.name = { $regex: name, $options: 'i' };
        if (model && model.length > 0) filter.model = { $regex: model, $options: 'i' };

        const products = await ProductModel.find(filter).select('-photo').populate('category');
        res.status(201).send({ 'status': "Pass", 'length': products.length, 'products': products });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Filter Products', error: error.message })
    }
}

export async function CategoryProducts(req, res) {
    try {
        const { CategoryID } = req.params;

        const products = await ProductModel.find({ category: CategoryID }).select('-photo').populate('category');
        res.status(201).send({ 'status': "Pass", 'length': products.length, 'products': products });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Filter Products', error: error.message })
    }
}



export async function SearchProduct(req, res) {
    try {
        const { keyword } = req.params;
        /* if The keyword is in name of product or in description the get that product */
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { tag: { $elemMatch: { $regex: keyword, $options: 'i' } } },
                { 'category.name': { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo').populate('category');

        res.status(200).send({ 'status': "Pass", 'length': products.length, 'products': products });

    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Search Product Functionality', error: error.message })
    }
}

export async function RelatedCategoryProduct(req, res) {
    try {
        const { ProductID, CategoryID, Brand } = req.params
        console.log("Params is ", ProductID, CategoryID, Brand);
        const Result = await ProductModel.find(
            {
                _id: { $ne: ProductID },
                category: CategoryID,
                brand: Brand
            }
        ).select('-photo').populate('category').sort({ _id: -1 }).limit(8);
        res.status(200).send({ 'status': "Pass", 'products': Result });
    } catch (error) {
        res.send({ 'status': 'Fail', 'message': 'Error in Related Product Category Functionality', error: error.message })
    }
}