const express = require('express');
var router = express.Router();
const usersController = require('../controllers/user');
const verifyToken = require('../middleware/authMiddleware');
const validateType = require('../middleware/validateType');

router.route('/')
    .get(verifyToken, validateType(['admin']), usersController.getUsers)
    .post(verifyToken, validateType(['admin' , 'customer']), usersController.createUser);

router.route('/:id')
    .get(verifyToken, validateType(['admin' , 'customer','supplier']), usersController.getUser)
    .patch(verifyToken, validateType(['admin' , 'customer','supplier']), usersController.updateUser)
    .delete(verifyToken, validateType(['admin']), usersController.deleteUser);

module.exports = router;