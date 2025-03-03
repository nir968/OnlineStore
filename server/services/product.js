const Product = require('../models/product');

const createProduct = async (category, subCategory, name, supplierId, manufacturer, price, currentStock, image, weight, weightUnit) => {
    const product = new Product({
        category : category,
        subCategory : subCategory,
        name : name,
        supplierId : supplierId,
        manufacturer : manufacturer,
        price : price,
        currentStock : currentStock,
        image : image,
        weight : weight, 
        weightUnit : weightUnit
    });

    return await product.save();
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const getProducts = async () => {
    return await Product.find({});
};

const updateProduct = async (id, category, subCategory,  name, supplierId, manufacturer, price, currentStock, image, weight, weightUnit) => {
    const product = await getProductById(id);
     if (!product)
        return null;

        product.category = category;
        product.subCategory = subCategory;
        product.name = name;
        product.supplierId = supplierId;
        product.manufacturer = manufacturer;
        product.price = price;
        product.currentStock = currentStock;
        product.image = image;
        product.weight = weight;
        product.weightUnit = weightUnit;

    await product.save();
    return product;
};

const deleteProduct = async (id) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    await product.remove();
    return product;
};

const searchProducts = async (query) => {
    return await Product.find(query);
};

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProducts
}