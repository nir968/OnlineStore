let map;
let marker;
let mapInitialized = false;
let selectedPlace = null;

// Initialize the map
async function initMap() {
  try {
    // Default map settings
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 31.771959, lng: 35.217018 }, // Default center location
      zoom: 12
    });

    // Setup search box for address input
    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Adjust the search box bounds based on the map's bounds
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    // Handle place selection from the search box
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      map.setCenter(place.geometry.location);
      selectedPlace = place;
      updateLocationFields(place.geometry.location, place.formatted_address);
    });

    // Allow manual placement of the marker by clicking on the map
    map.addListener('click', (event) => {
      placeMarker(event.latLng);
    });
  } catch (error) {
    console.error('Error initializing map:', error);
  }
}

// Place a marker at the given location and update the fields
function placeMarker(location) {
  if (marker) {
    marker.setPosition(location);
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }

  // Reverse geocode the location to get the address
  geocodeLatLng(location).then(address => {
    updateLocationFields(location, address);
  }).catch(error => {
    console.error('Error getting address:', error);
    updateLocationFields(location, 'Unknown location');
  });
}

// Update the hidden fields and address field based on the selected location
function updateLocationFields(location, address) {
  document.getElementById('latitude').value = location.lat();
  document.getElementById('longitude').value = location.lng();
  document.getElementById('location-name').value = address;
  document.getElementById('registerStreet').value = address;
}

// Reverse geocode to get the address from latitude and longitude
async function geocodeLatLng(location) {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject('Geocode was not successful for the following reason: ' + status);
      }
    });
  });
}



// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    //console.log(email)
    //console.log(password)

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'homepage.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed: An unexpected error occurred.');
    }
});

// Handle register form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const type = document.getElementById('registerType').value;
    const streetAddress = document.getElementById('registerStreet').value;
    const city = document.getElementById('registerCity').value;

    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, type, firstName, lastName, streetAddress, city })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'homepage.html';
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed: An unexpected error occurred.');
    }
});

// Initialize the map when the modal is shown
$('#addressModal').on('shown.bs.modal', function () {
    if (!mapInitialized) {
      initMap();
      mapInitialized = true;
    }
  });