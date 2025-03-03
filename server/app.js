const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const users = require('./routes/user');
const products = require('./routes/product');
const orders = require('./routes/order');


require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, 
                {   useNewUrlParser: true, 
                    useUnifiedTopology: true });
                    

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/products', products);
app.use('/users', users);
app.use('/orders', orders);

app.listen(process.env.PORT);