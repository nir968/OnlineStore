function checkAdminAccess() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Access denied. No token found.');
    window.location.href = 'homepage.html';
    return;
  }

  try {
    const decodedToken = jwt_decode(token);
    console.log(decodedToken);
    if (decodedToken.type !== 'admin') {
      alert('Access denied. Only admins can access this page.');
      window.location.href = 'homepage.html';
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    alert('Access denied. Invalid token.');
    window.location.href = 'homepage.html';
  }
}

const userTable = document.getElementById('userTable');
    const searchUser = document.getElementById('searchUser');
    let users = [];

    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:8080/users/', {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`, // Include token for authentication
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }

        users = await response.json();
        renderUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    function renderUsers(users) {
      userTable.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="mt-4">${user.firstName}</td>
          <td class="mt-4">${user.lastName}</td>
          <td class="mt-4">${user._id}</td>
          <td class="mt-4">${user.email}</td>
          <td class="mt-4"><button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')"><i class="bi bi-x"></i></button></td>
        `;
        userTable.appendChild(row);
      });
    }

    async function deleteUser(userId) {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`, // Include token for authentication
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error deleting user ${userId}: ${response.statusText}`);
        }

        // Remove the user from the local list and re-render the table
        users = users.filter(user => user._id !== userId);
        renderUsers(users);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }

    searchUser.addEventListener('input', () => {
      const searchText = searchUser.value.toLowerCase();
      const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchText) ||
        user.lastName.toLowerCase().includes(searchText) ||
        user.userId.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText)
      );
      renderUsers(filteredUsers);
    });

    // Initial fetch and render
    fetchUsers();

 // Fetch and render income data using D3.js
async function fetchIncomeData() {
  try {
    const response = await fetch('http://localhost:8080/orders/income-per-supplier', {
      method: 'GET',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching income data: ${response.statusText}`);
    }

    const incomeData = await response.json();
    renderIncomeChart(incomeData);
  } catch (error) {
    console.error('Error fetching income data:', error);
  }
}

function renderIncomeChart(incomeData) {
  // Set up dimensions and margins for the chart
  const margin = { top: 20, right: 30, bottom: 100, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page
  const svg = d3.select("#incomeChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X scale
  const x = d3.scaleBand()
    .domain(incomeData.map(d => d.supplierName))
    .range([0, width])
    .padding(0.2);

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(incomeData, d => d.totalIncome)])
    .nice() // Round up domain to nice round numbers
    .range([height, 0]);

  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add bars
  svg.selectAll("rect")
    .data(incomeData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.supplierName))
    .attr("y", d => y(d.totalIncome))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.totalIncome))
    .attr("fill", "rgba(75, 192, 192, 0.6)");

  // Add Y axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top)
    .attr("transform", "rotate(-90)")
    .text("Income ($)");

  // Add X axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .text("Supplier");
}

// Fetch income data and render the chart on page load
fetchIncomeData();