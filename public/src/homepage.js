document.addEventListener("DOMContentLoaded", function() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const userType = decodedToken.type;
      updateNavbar(userType);
      fetchCart();
    } catch (error) {
      console.error("Error decoding token:", error);
      updateNavbar(null);
    }
  } else {
    updateNavbar(null);
  }

  function updateNavbar(userType) {
    let navbarContent = '';

    switch (userType) {
      case 'customer':
        navbarContent = `
          <div class="container-fluid">
            <div class="navbar-brand">
              <button class="btn btn-filter" id="logoutButton">Log Out</button>
              <button class="btn btn-filter"><a href="Personal_Portal.html" class="login_btn">Personal Portal</a></button>
            </div>
            <div class="navbar-nav">
              <div class="nav-item">
                <div class="input-group">
                  <input type="text" class="form-control" id="productSearch" placeholder="Search in Super Eats">
                  <div id="searchSuggestions" class="dropdown-menu"></div>
                </div>
              </div>
            </div>
            <div class="nav-right">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                 Catalouge <i class="bi bi-list"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <a class="Cat">Menu</a>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/milk-dairy-icon.jpg" class="icon"> Dairy and Eggs</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fruit-icon.jpg" class="icon"> Fruit and Vegetables</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fish-meat-icon.jpg" class="icon"> Meat and Fish</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/sweetandsalty-icon.jpg" class="icon"> Sweet & Salty</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/drink-icon.jpg" class="icon"> Beverages</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/frozen-icon.jpg" class="icon"> Frozen Produce</a></li>
                </ul>
              </div>
              <a class="navbar-brand" href="#">
                <img src="Pictures/logo.jpg" alt="Logo">
              </a>
            </div>
          </div>
        `;
        break;
      case 'admin':
        navbarContent = `
          <div class="container-fluid">
            <div class="navbar-brand">
              <button class="btn btn-filter" id="logoutButton">Log Out</button>
              <button class="btn btn-filter"><a href="Personal_Portal.html" class="login_btn">Personal Portal</a></button>
              <button class="btn btn-filter"><a href="user-managment.html" class="login_btn">User Management</a></button>
              <button class="btn btn-filter"><a href="orders_Managment.html" class="login_btn">Order Management</a></button>
            </div>
            <div class="navbar-nav" >
              <div class="nav-item">
                <div class="input-group">
                  <input type="text" class="form-control" id="productSearch" placeholder="Search in Super Eats">
                  <div id="searchSuggestions" class="dropdown-menu"></div>
                </div>
              </div>
            </div>
            <div class="nav-right">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                 Catalogue <i class="bi bi-list"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <a class="Cat">Menu</a>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/milk-dairy-icon.jpg" class="icon" data-category="Dairy and Eggs"> Dairy and Eggs</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fruit-icon.jpg" class="icon" data-category="Fruit and Vegetables"> Fruit and Vegetables</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fish-meat-icon.jpg" class="icon" data-category="Meat and Fish"> Meat and Fish</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/sweetandsalty-icon.jpg" class="icon" data-category="Sweet & Salty"> Sweet & Salty</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/drink-icon.jpg" class="icon" data-category="Beverages"> Beverages</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/frozen-icon.jpg" class="icon" data-category="Frozen Produce"> Frozen Produce</a></li>
                </ul>
              </div>
              <a class="navbar-brand" href="#">
                <img src="Pictures/logo.jpg" alt="Logo">
              </a>
            </div>
          </div>
        `;
        break;
      case 'supplier':
        navbarContent = `
          <div class="container-fluid">
            <div class="navbar-brand">
              <button class="btn btn-filter" id="logoutButton">Log Out</button>
              <button class="btn btn-filter"><a href="Personal_Portal.html" class="login_btn">Personal Portal</a></button>
              <button class="btn btn-filter"><a href="Product-mangment.html" class="login_btn">Manage Products</a></button>
            </div>
            <div class="navbar-nav">
              <div class="nav-item">
                <div class="input-group">
                  <input type="text" class="form-control" id="productSearch" placeholder="Search in Super Eats">
                  <div id="searchSuggestions" class="dropdown-menu"></div>
                </div>
              </div>
            </div>
            <div class="nav-right">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Catalouge <i class="bi bi-list"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <a class="Cat">Menu</a>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/milk-dairy-icon.jpg" class="icon" data-category="Dairy and Eggs"> Dairy and Eggs</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fruit-icon.jpg" class="icon" data-category="Fruit and Vegetables"> Fruit and Vegetables</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fish-meat-icon.jpg" class="icon" data-category="Meat and Fish"> Meat and Fish</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/sweetandsalty-icon.jpg" class="icon" data-category="Sweet & Salty"> Sweet & Salty</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/drink-icon.jpg" class="icon" data-category="Beverages"> Beverages</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/frozen-icon.jpg" class="icon" data-category="Frozen Produce"> Frozen Produce</a></li>
                </ul>
              </div>
              <a class="navbar-brand" href="#">
                <img src="Pictures/logo.jpg" alt="Logo">
              </a>
            </div>
          </div>
        `;
        break;
      default:
        navbarContent = `
          <div class="container-fluid">
            <div class="navbar-brand">
              <button class="btn btn-filter"><a href="reglog.html" class="login_btn">Log In</a></button>
            </div>
            <div class="navbar-nav flex-grow-1">
              <div class="nav-item">
                <div class="input-group">
                  <input type="text" class="form-control" id="productSearch" placeholder="Search in Super Eats">
                  <div id="searchSuggestions" class="dropdown-menu"></div>
                </div>
              </div>
            </div>
            <div class="nav-right">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                 Catalouge <i class="bi bi-list"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <a class="Cat">Menu</a>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/milk-dairy-icon.jpg" class="icon" data-category="Dairy and Eggs"> Dairy and Eggs</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fruit-icon.jpg" class="icon" data-category="Fruit and Vegetables"> Fruit and Vegetables</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/fish-meat-icon.jpg" class="icon" data-category="Meat and Fish"> Meat and Fish</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/sweetandsalty-icon.jpg" class="icon" data-category="Sweet and Salty"> Sweet & Salty</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/drink-icon.jpg" class="icon" data-category="Beverages"> Beverages</a></li>
                  <li><a class="dropdown-item" href="#"><img src="Pictures/frozen-icon.jpg" class="icon" data-category="Frozen Produce"> Frozen Produce</a></li>
                </ul>
              </div>
              <a class="navbar-brand" href="#">
                <img src="Pictures/logo.jpg" alt="Logo">
              </a>
            </div>
          </div>
        `;
        break;
    }

    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
      navbarElement.innerHTML = navbarContent;

      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', function() {
          localStorage.clear();
          location.reload();
        });
      }
    } else {
      console.error("Navbar element not found.");
    }
  }

let allProducts = [];
async function fetchAllProducts() {
  try {
    const token = localStorage.getItem('token'); 

    const response = await fetch('http://localhost:8080/products/', {
      method: 'GET',
      headers: {
        'Authorization': `${token}` 
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    allProducts = await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

  fetchAllProducts();

  const searchInput = document.getElementById('productSearch');
  const searchSuggestions = document.getElementById('searchSuggestions');

  if (searchInput && searchSuggestions) {
    searchInput.addEventListener('input', function() {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
      );

      searchSuggestions.innerHTML = '';

      filteredProducts.forEach(product => {
        const suggestionItem = document.createElement('a');
        suggestionItem.classList.add('dropdown-item');
        suggestionItem.addEventListener('click', () => {
          window.location.href = `product/itempage-template.html?id=${product._id}`;
       });
        suggestionItem.innerHTML = `
          <div class="suggestion-item">
            <img src="${product.image}" alt="${product.name}" class="suggestion-image">
            <span>${product.name}</span>
          </div>
        `;
        searchSuggestions.appendChild(suggestionItem);
      });

      if (filteredProducts.length > 0) {
        searchSuggestions.style.display = 'block';
      } else {
        searchSuggestions.style.display = 'none';
      }
    });

    document.addEventListener('click', function(event) {
      if (!searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
        searchSuggestions.style.display = 'none';
      }
    });
  } else {
    console.error("Search input or suggestions container not found.");
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const cartSection = document.querySelector('.cart-section');
  const footer = document.querySelector('footer');
  const originalCartTop = cartSection.offsetTop;
  const cartHeight = cartSection.offsetHeight;

  window.addEventListener('scroll', function () {
    const footerTop = footer.offsetTop;
    const scrollTop = window.scrollY;

    if (scrollTop + cartHeight >= footerTop) {
      cartSection.classList.add('sticky');
      cartSection.style.top = `${footerTop - cartHeight}px`;
    } else if (scrollTop > originalCartTop) {
      cartSection.classList.remove('sticky');
      cartSection.style.top = '150px';
    } else {
      cartSection.classList.remove('sticky');
      cartSection.style.top = `${originalCartTop}px`;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const categoryItems = document.querySelectorAll('.category-item');

  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const subcategory = item.getAttribute('data-subcategory');

      window.location.href = `category_page.html?subCategory=${encodeURIComponent(subcategory)}`;
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.querySelector('.icon').getAttribute('data-category');
      window.location.href = `category_page.html?category=${encodeURIComponent(category)}`;
    });
  });
});
