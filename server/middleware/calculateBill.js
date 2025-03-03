const Product = require('../models/product'); 

const calculateBill = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.id);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

module.exports = calculateBill;