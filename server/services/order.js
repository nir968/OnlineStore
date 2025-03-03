const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user'); 
const calculateBill = require('../middleware/calculateBill'); 


const createOrder = async (customerId, items, ordered, bill) => {

    if (!Array.isArray(items) || items.length > 0) {
        throw new Error('Items array must be empty when creating a new order');
    }

    const order = new Order({
        customerId,
        items,
        ordered 
    });

    order.bill = await calculateBill(items);
    return await order.save();
};

const getOrderById = async (id) => {
    return await Order.findById(id).populate('items');
};

const getOrders = async () => {
    return await Order.find({}).populate('items');
};

const updateOrder = async (id, customerId, items, ordered, bill) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    order.customerId = customerId;
    order.items = items;
    order.ordered = ordered;

    order.bill = await calculateBill(items);

    await order.save();
    return order;
};

const deleteOrder = async (id) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    for (const item of order.items) {
        const product = await Product.findById(item.id);
        if (product) {
            product.currentStock += item.quantity;
            await product.save();
        }
    }

    await order.remove();
    return order;
};


const addToCart = async (id, productId) => {
    const order = await getOrderById(id);
    if (!order) {
        throw new Error('Order not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    //console.log(product)


    const item = order.items.find(item => item.id.equals(productId));
    if (item) {
        if (product.currentStock < 1) {
            throw new Error('Not enough stock');
        }
        item.quantity += 1;
    } else {
        if (product.currentStock < 1) {
            throw new Error('Not enough stock');
        }
        order.items.push({ id: productId, quantity: 1, name: product.name });
    }
    product.currentStock -= 1;
    await product.save();

    order.bill = await calculateBill(order.items);

    await order.save();
    return order;
};


const removeFromCart = async (id, productId) => {
    const order = await getOrderById(id);
    if (!order) {
        throw new Error('Order not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const itemIndex = order.items.findIndex(item => item.id.equals(productId));
    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    const item = order.items[itemIndex];
    if (item.quantity <= 1) {
        order.items.splice(itemIndex, 1);
    } else {
        item.quantity -= 1;
    }

    product.currentStock += 1;
    await product.save();

    order.bill = await calculateBill(order.items);

    await order.save();
    return order;
};


const cleanCart = async (id) => {
    const order = await getOrderById(id);
    if (!order) {
        throw new Error('Order not found');
    }

    for (const item of order.items) {
        const product = await Product.findById(item.id);
        if (product) {
            product.currentStock += item.quantity;
            await product.save();
        }
    }

    order.items = [];
    order.bill = 0; 

    await order.save();
    return order;
};


const aggregateTotalBillByCustomer = async (customerId) => {
    return await Order.aggregate([
        { $match: { customerId: customerId , ordered: true } },
        {
            $group: {
                _id: "$customerId",
                totalBill: { $sum: "$bill" }
            }
        }
    ]);
};


const findOrCreateCart = async (customerId) => {
    let order = await Order.findOne({ customerId, ordered: false });

    if (!order) {
        order = new Order({ bill : 0 , customerId : customerId, items: [], ordered: false });
        await order.save();
    }

    return order;
};

const searchOrders = async (query) => {
    return await Order.find(query);
};


const getMostPopularProducts = async () => {
    return await Order.aggregate([
        { $match: { ordered: true } }, 
        { $unwind: "$items" }, 
        {
            $group: {
                _id: "$items.id", 
                name: { $first: "$items.name" }, 
                totalQuantity: { $sum: "$items.quantity" } 
            }
        },
        { $sort: { totalQuantity: -1 } }, 
        { $limit: 10 } 
    ]);
};


const calculateIncomePerSupplier = async () => {
    try {
        const orders = await Order.find({ ordered: true }).populate('items.id');

        const supplierIncomeMap = {};

        for (const order of orders) {
            for (const item of order.items) {
                const product = item.id;  
                if (product) {
                    const totalIncomeForItem = product.price * item.quantity;
                    const supplierId = product.supplierId;

                    if (supplierIncomeMap[supplierId]) {
                        supplierIncomeMap[supplierId].totalIncome += totalIncomeForItem;
                    } else {
                        supplierIncomeMap[supplierId] = {
                            supplierId: supplierId,
                            totalIncome: totalIncomeForItem
                        };
                    }
                }
            }
        }

        const incomeData = [];
        for (const [supplierId, incomeInfo] of Object.entries(supplierIncomeMap)) {
            const supplierName = await getSupplierName(supplierId);  // Retrieve the supplier name
            incomeData.push({
                supplierId: supplierId,
                supplierName: supplierName,
                totalIncome: incomeInfo.totalIncome
            });
        }

        return incomeData;
    } catch (error) {
        console.error('Error calculating income per supplier:', error);
        throw error;
    }
};

const getSupplierName = async (supplierId) => {
    try {
      const supplier = await User.findById(supplierId);
  
      if (supplier && supplier.type === 'supplier') {
        return `${supplier.firstName} ${supplier.lastName}`;
      } else {
        return 'Unknown Supplier';
      }
    } catch (error) {
      console.error(`Error fetching supplier name for ID ${supplierId}:`, error);
      return 'Unknown Supplier';
    }
  };




module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    updateOrder,
    deleteOrder,
    addToCart,
    removeFromCart,
    cleanCart,
    aggregateTotalBillByCustomer,
    findOrCreateCart,
    searchOrders,
    getMostPopularProducts,
    calculateIncomePerSupplier
};
