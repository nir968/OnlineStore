const productService = require('../services/product');
const hasAllFields = require('../middleware/hasAllFiels'); 
const validEnum = require('../middleware/validEnum');

const validWeightUnits = ['g', 'kg', 'ml', 'l'];


const createProduct = async (req, res) => {
    try {
      const requiredFields = ['category', 'subCategory' , 'name', 'supplierId', 'manufacturer', 'price', 'currentStock' , 'weight' , 'weightUnit'];

      if (!hasAllFields(req, res, requiredFields)) return;
      if (!validEnum('weightUnit', validWeightUnits)(req, res)) return;
  
      const newProduct = await productService.createProduct(
        req.body.category,
        req.body.subCategory,
        req.body.name,
        req.body.supplierId,
        req.body.manufacturer,
        req.body.price,
        req.body.currentStock,
        req.body.image,
        req.body.weight,
        req.body.weightUnit
      );
  
      res.json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const getProducts = async (req, res) => {
    const products = await productService.getProducts();
    res.json(products);
};

const getProduct = async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ errors: ['Product not found'] });
      }
  
      res.json(product);
    } catch (error) {
      //console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const updateProduct = async (req, res) => {
    try {
      const requiredFields = ['category','subCategory', 'name', 'supplierId', 'manufacturer', 'price', 'currentStock' , 'weight' , 'weightUnit'];
  
      if (!hasAllFields(req, res, requiredFields)) return;
      if (!validEnum('weightUnit', validWeightUnits)(req, res)) return;
        
      const product = await productService.updateProduct(
        req.params.id,
        req.body.category,
        req.body.subCategory,
        req.body.name,
        req.body.supplierId,
        req.body.manufacturer,
        req.body.price,
        req.body.currentStock,
        req.body.image,
        req.body.weight,
        req.body.weightUnit
      );
  
      if (!product) {
        return res.status(404).json({ errors: ['Product not found'] });
      }
  
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ errors: ['Product not found'] });
      }
      
      res.send();
    } catch (error) {
      //console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const searchProducts = async (req, res) => {
    try {
      const { category, subCategory, price, manufacturer, name, currentStock, supplierId } = req.query;
      const query = {};

        if (category) {
            query.category = category;
        }

        if (subCategory) {
          query.subCategory = subCategory;
      }

        if (price) {
            const operatorMatch = price.match(/(<=|>=|<|>|=)/);
            if (operatorMatch) {
                const operator = operatorMatch[0];
                const value = parseFloat(price.slice(operator.length).trim());

                if (operator === '<=') {
                    query.price = { $lte: value };
                } else if (operator === '>=') {
                    query.price = { $gte: value };
                } else if (operator === '<') {
                    query.price = { $lt: value };
                } else if (operator === '>') {
                    query.price = { $gt: value };
                } else if (operator === '=') {
                    query.price = value;
                }
            } else {
                query.price = parseFloat(price);
            }
        }

        if (manufacturer) {
            query.manufacturer = manufacturer;
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' }; 
        }

        if (currentStock) {
            const operatorMatch = currentStock.match(/(<=|>=|<|>|=)/);
            if (operatorMatch) {
                const operator = operatorMatch[0];
                const value = parseInt(currentStock.slice(operator.length).trim(), 10);

                if (operator === '<=') {
                    query.currentStock = { $lte: value };
                } else if (operator === '>=') {
                    query.currentStock = { $gte: value };
                } else if (operator === '<') {
                    query.currentStock = { $lt: value };
                } else if (operator === '>') {
                    query.currentStock = { $gt: value };
                } else if (operator === '=') {
                    query.currentStock = value;
                }
            } else {
                query.currentStock = parseInt(currentStock, 10);
            }
        }

        if (supplierId) {
          query.supplierId = supplierId;
      }

        const products = await productService.searchProducts(query);
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

  module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  };