
document.addEventListener('DOMContentLoaded', function() {
    const productData = JSON.parse(localStorage.getItem('productData'));

    if (productData) {
        document.getElementById('category-link').textContent = productData.category;
        document.getElementById('sub-category-link').textContent = productData.subCategory;
        document.getElementById('product-name').textContent = productData.name;
        document.getElementById('product-image').src = productData.image;
        document.getElementById('product-price').textContent = `₪${productData.price}`;
        document.getElementById('product-manufacturer').textContent = productData.manufacturer;
        document.getElementById('product-weight').textContent = `${productData.weight} ${productData.weightUnit}`;

        document.getElementById('add-to-cart-button').addEventListener('click', function() {
            addToCart(productData._id);
        });
    }
});


document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productId) {
      try {
        const productData = await fetchData(productId);
  
        if (productData) {
          document.getElementById('category-link').textContent = productData.category;
          document.getElementById('sub-category-link').textContent = productData.subCategory;
          document.getElementById('product-name').textContent = productData.name;
          document.getElementById('product-image').src = productData.image;
          document.getElementById('product-price').textContent = `₪${productData.price}`;
          document.getElementById('product-manufacturer').textContent = productData.manufacturer;
          document.getElementById('product-weight').textContent = `${productData.weight} ${productData.weightUnit}`;
          document.getElementById('add-to-cart-button').addEventListener('click', function() {
            addToCart(productData._id);
          });
        } else {
          alert('Product data not found');
        }
      } catch (error) {
        alert('Error fetching product data');
        console.error(error);
      }
    } 
  });


async function fetchData(productId) {
    try {
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching product data: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
    }
  }

  const token = localStorage.getItem('token');
  const lastPage = localStorage.getItem('lastPage').slice(-23);

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const userType = decodedToken.type;
      if (userType == "supplier" && lastPage == 'product/createitem.html') {
        const facebookPostButton = document.getElementById('facebook-post-button');
        facebookPostButton.style.display = 'inline-block';
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.log("no token");
  }

  
// 'Post On Facebook' function

  async function postOnFacebook() {
    const content = localStorage.getItem('productData');
    const productData = JSON.parse(content);

    const timestamp = new Date().toISOString(); // Add timestamp to ensure uniqueness
    const message = `
    🌟 New Arrival Alert! 🌟
    
    We are excited to introduce our latest product: ${productData.name}!
    
    This product is now available in our store. 
    
    🏷️ Price: $${productData.price}
    📦 Current Stock: ${productData.currentStock} units
    ⚖️ Weight: ${productData.weight} ${productData.weightUnit}
    
    Don't miss out! Visit us today and get your hands on this fantastic new item.
    
    #NewProduct #${productData.category.replace(/ /g, '')} #${productData.subCategory.replace(/ /g, '')} #${productData.manufacturer.replace(/ /g, '')}
    \nPosted at: ${timestamp}
    `;

    const imageUrl = productData.image;
    const accessToken = "EAANiSIMXHsgBO2wpKLteaiQJbDHQsyZBi1w7fTE8oZABEQtaRYf9UPajN6VlrcrOEqp1311xKuIn34y2CKpqqTTCFRUunxpmJj7Xzq6aUK0t2OdkHZCRdrr6ZCT99uZAmslXPwTI296jZBe4GzuBZC6pKvnGdO0WvEeWoZBQuRLiWNCZAtteskNCMI39sWNprjpSrowW8wzZAS"; // Replace with your actual access token
    const pageId = "401296996394006";

    const button = document.getElementById('facebook-post-button');
    const loader = document.getElementById('loader');

    button.disabled = true;
    loader.style.display = 'inline-block';

    try {
        // Step 1: Create the post with the photo URL directly
        const postData = {
            message: message,
            link: imageUrl, // Using link to the image instead of uploading it
            access_token: accessToken
        };

        console.log('Post Data:', postData); // Log the post data for debugging

        // Step 2: Create the post with the photo
        const createPostResponse = await fetch(`https://graph.facebook.com/v17.0/${pageId}/feed`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        const createPostResult = await createPostResponse.json();

        if (createPostResult.error) {
            throw new Error(createPostResult.error.message);
        }

        // Handle the result of the post creation
        if (createPostResult.id) {
            loader.style.display = 'none';
            button.textContent = 'Posted!';
            setTimeout(() => {
                button.style.opacity = '0';
                setTimeout(() => {
                    button.style.display = 'none';
                    loader.style.display = 'none';
                }, 1000);
            }, 1000);
        } else {
            throw new Error('Post creation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        button.disabled = false;
        loader.style.display = 'none';
        button.textContent = 'Post on Facebook'; // Reset the button text
        alert(`Failed to post on Facebook. Please try again.\nError: ${error.message}`);
    }
    localStorage.setItem('lastPage', null);
}