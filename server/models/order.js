const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
 
  customerId: {
    type: String,
    required: true
  },
  items: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    name: {
      type: String,
      required: true
    }
  }],
  ordered: {
    type: Boolean,
    required: true
  },
  bill: {
    type: Number,
    default: 0
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
