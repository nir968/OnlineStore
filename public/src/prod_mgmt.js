function checkAdminAccess() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Access denied. No token found.');
    window.location.href = 'homepage.html';
    return;
  }

  try {
    const decodedToken = jwt_decode(token);
    //console.log(decodedToken);
    if (decodedToken.type !== 'supplier') {
      alert('Access denied. Only suppliers can access this page.');
      window.location.href = 'homepage.html';
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    alert('Access denied. Invalid token.');
    window.location.href = 'homepage.html';
  }
}

const productTable = document.getElementById('productTable');
const searchProduct = document.getElementById('searchProduct');
const addProductBtn = document.getElementById('addProductBtn');

const addProductForm = document.getElementById('addProductForm');
let products = [];
let UserId = null;

// Decode token to get the Current User ID
function getUserId() {
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);
  return decodedToken.userId; // Assuming the token contains the supplier's ID
}

async function fetchProducts() {
  UserId = getUserId();
  //console.log(UserId);
  
  try {
    const response = await fetch(`http://localhost:8080/products/search?supplierId=${UserId}`, {
      method: 'GET',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function renderProducts(products) {
  productTable.innerHTML = '';
  products.forEach(product => {
    //console.log(product.supplierId);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="mt-4">${product.name}</td>
      <td class="mt-4">${product._id}</td>
      <td>
        <div class="input-group mb-3">
          <input type="number" class="form-control price" value="${product.price}">
          <button class="btn btn-success btn-sm input-group-text" onclick="saveProductPrice('${product._id}', this.previousElementSibling.value)"><i class="bi bi-check"></i></button>
        </div>
      </td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')"><i class="bi bi-x"></i></button></td>
    `;
    productTable.appendChild(row);
  });
}

async function saveProductPrice(productId, newPrice) {
  try {
    const product = products.find(p => p._id === productId);
    const body = {
      _id: product._id,
      category: product.category,
      subCategory: product.subCategory,
      name: product.name,
      supplierId: product.supplierId,
      manufacturer: product.manufacturer,
      price: parseFloat(newPrice), // Ensure the price is sent as a number
      currentStock: product.currentStock,
      image: product.image,
      weight: product.weight,
      weightUnit: product.weightUnit,
      __v: product.__v
    };

    const response = await fetch(`http://localhost:8080/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error updating product price: ${response.statusText}, ${errorText}`);
    }

    const updatedProduct = await response.json();

    const index = products.findIndex(p => p._id === productId);
    products[index].price = updatedProduct.price;
    renderProducts(products);
  } catch (error) {
    console.error('Error updating product price:', error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:8080/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.statusText}`);
    }

    products = products.filter(product => product._id !== productId);
    renderProducts(products);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

searchProduct.addEventListener('input', () => {
  const searchText = searchProduct.value.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText) ||
    product._id.toLowerCase().includes(searchText)
  );
  renderProducts(filteredProducts);
});

addProductBtn.addEventListener('click', () => {
  window.location.href = './product/createitem.html';
});

addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;
  try {
    const response = await fetch('http://localhost:8080/products/', {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: productName, 
        price: parseFloat(productPrice), // Ensure price is a number
        supplierId 
      }) 
    });

    if (!response.ok) {
      throw new Error(`Error adding product: ${response.statusText}`);
    }

    const newProduct = await response.json();
    products.push(newProduct);
    renderProducts(products);
  } catch (error) {
    console.error('Error adding product:', error);
  }
});

// Initial fetch and render
checkAdminAccess();
fetchProducts();
