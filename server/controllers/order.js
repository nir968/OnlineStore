const orderService = require('../services/order');
const hasAllFields = require('../middleware/hasAllFiels'); 

const createOrder = async (req, res) => {
    try {
        const requiredFields = ['customerId', 'items'];
  
        if (!hasAllFields(req, res, requiredFields)) return;

        const items = req.body.items || [];
        if (!Array.isArray(items) || items.length > 0) {
            return res.status(400).json({ message: 'Items array must be empty when creating a new order' });
        }

        const bill = req.body.bill !== undefined ? req.body.bill : 0;
        const ordered = req.body.ordered !== undefined ? req.body.ordered : false; 
  
        const newOrder = await orderService.createOrder(
            req.body.customerId,
            req.body.items,
            ordered,
            bill
        );
  
        res.json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
      
        if (!order) {
            return res.status(404).json({ errors: ['Order not found'] });
        }
  
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const requiredFields = ['customerId', 'items', 'ordered', 'bill'];
  
        if (!hasAllFields(req, res, requiredFields)) return;
  
        const order = await orderService.updateOrder(
            req.params.id,
            req.body.customerId,
            req.body.items,
            req.body.ordered,
            req.body.bill
        );
  
        if (!order) {
            return res.status(404).json({ errors: ['Order not found'] });
        }
  
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await orderService.deleteOrder(req.params.id);
      
        if (!order) {
            return res.status(404).json({ errors: ['Order not found'] });
        }
      
        res.send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const addToCart = async (req, res) => {
    try {
        const { id, productId } = req.params;
        if (!id || !productId) {
            return res.status(400).json({ error: 'Order ID and Product ID are required' });
        }

        const order = await orderService.addToCart(id, productId);
        res.json(order);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { id, productId } = req.params;
        if (!id || !productId) {
            return res.status(400).json({ error: 'Order ID and Product ID are required' });
        }

        const order = await orderService.removeFromCart(id, productId);
        res.json(order);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: error.message });
    }
};


const cleanCart = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const order = await orderService.cleanCart(id);
        res.json(order);
    } catch (error) {
        console.error('Error cleaning cart:', error);
        res.status(500).json({ message: error.message });
    }
};



const aggregateTotalBillByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const result = await orderService.aggregateTotalBillByCustomer(customerId);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'No orders found for the given customer ID' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error aggregating total bill by customer:', error);
        res.status(500).json({ message: error.message });
    }
};


const getMyCart = async (req, res) => {
    try {
        const userId = req.userId; 
        const order = await orderService.findOrCreateCart(userId);
        res.json(order);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchOrders = async (req, res) => {
    try {
        const { customerId, minBill, maxBill, ordered } = req.query;
        const query = {};

        if (customerId) {
            query.customerId = customerId;
        }

        if (ordered !== undefined) {
            query.ordered = ordered === 'true';
        }

        if (minBill) {
            query.bill = { ...query.bill, $gte: parseFloat(minBill) };
        }

        if (maxBill) {
            query.bill = { ...query.bill, $lte: parseFloat(maxBill) };
        }

        const orders = await orderService.searchOrders(query);
        res.json(orders);
    } catch (error) {
        console.error('Error searching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getMostPopularProducts = async (req, res) => {
    try {
        const mostPopularProducts = await orderService.getMostPopularProducts();
        res.json(mostPopularProducts);
    } catch (error) {
        console.error('Error fetching most popular products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getIncomePerSupplier = async (req, res) => {
    try {
        const incomeData = await orderService.calculateIncomePerSupplier();
        if (incomeData.length === 0) {
            return res.status(404).json({ message: 'No income data found' });
        }
        res.json(incomeData);
    } catch (error) {
        console.error('Error calculating income per supplier:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    addToCart,
    removeFromCart,
    cleanCart,
    aggregateTotalBillByCustomer,
    getMyCart,
    searchOrders,
    getMostPopularProducts,
    getIncomePerSupplier
};
