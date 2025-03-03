const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');
const verifyToken = require('../middleware/authMiddleware');
const validateType = require('../middleware/validateType');

router.route('/')
    .get(verifyToken, validateType(['admin']), ordersController.getOrders)
    .post(verifyToken, validateType(['admin', 'customer','supplier']), ordersController.createOrder);

router.route('/search')
    .get(verifyToken, validateType(['admin', 'customer', 'supplier']), ordersController.searchOrders);

    
router.get('/most-popular-products', verifyToken, validateType(['admin', 'customer', 'supplier']), ordersController.getMostPopularProducts);
router.get('/income-per-supplier', verifyToken, validateType(['admin']), ordersController.getIncomePerSupplier);



router.get('/get-my-cart', verifyToken, validateType(['admin', 'customer','supplier']), ordersController.getMyCart);

router.route('/:id')
    .get(verifyToken, validateType(['admin', 'customer','supplier']), ordersController.getOrderById)
    .patch(verifyToken, validateType(['admin', 'customer','supplier']), ordersController.updateOrder)
    .delete(verifyToken, validateType(['admin', 'customer','supplier']), ordersController.deleteOrder);

router.post('/:id/add-to-cart/:productId', verifyToken, validateType(['admin', 'customer','supplier']), ordersController.addToCart); 
router.post('/:id/remove-from-cart/:productId', verifyToken, validateType(['admin', 'customer','supplier']), ordersController.removeFromCart); 
router.post('/:id/clean-cart', verifyToken, validateType(['admin', 'customer','supplier']), ordersController.cleanCart); 

router.get('/aggregate/total-bill-by-customer/:customerId', verifyToken, validateType(['admin', 'customer','supplier']), ordersController.aggregateTotalBillByCustomer);


module.exports = router;

