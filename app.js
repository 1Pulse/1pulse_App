// Initialize map
const map = L.map('map').setView([-26.2041, 28.0473], 13); // Centered on Johannesburg

// Set up a light grey theme tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

// Define icons for each incident type
const icons = {
    'Good Deeds': L.icon({ iconUrl: 'images/Africa City.png', iconSize: [30, 30] }),
    'Health': L.icon({ iconUrl: 'health.png', iconSize: [30, 30] }),
    'Property Damage': L.icon({ iconUrl: 'property-damage.png', iconSize: [30, 30] }),
    'Violent Crime': L.icon({ iconUrl: 'violent-crime.png', iconSize: [30, 30] }),
    'Looting': L.icon({ iconUrl: 'looting.png', iconSize: [30, 30] }),
    'Xenophobia': L.icon({ iconUrl: 'xenophobia.png', iconSize: [30, 30] }),
  };

// Predefined addresses for specific latitude and longitude points
const addressLookup = {
  "-26.2041,28.0473": "Johannesburg City Center, South Africa",
  "-26.1952,28.0342": "Braamfontein, Johannesburg, South Africa",
  "-26.2023,28.0436": "Newtown, Johannesburg, South Africa",
  // Add more predefined addresses here as needed
};

// Sample data for incidents
const sampleData = [
    {
      type: 'Good Deeds',
      name: 'John Doe',
      description: 'Helped an elderly person cross the road',
      date: '2024-11-11',
      time: '14:30',
      location: [-26.2041, 28.0473],
      imageUrl: 'images/Pulse Cover2.jpg',
    },
    // Add more sample data here
  ];

// Function to create a marker for each sample incident
sampleData.forEach(data => {
  const marker = L.marker(data.location, { icon: icons[data.type] }).addTo(map);
  marker.bindPopup(`
    <strong>${data.type}</strong><br>
    <em>${data.date} ${data.time}</em><br>
    ${data.description}<br>
    <img src="${data.imageUrl}" alt="Incident image" width="100" height="100">
    <p>Submitted by: ${data.name}</p>
  `);
});

// Function to find the closest predefined address
function getPredefinedAddress(lat, lng) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  return addressLookup[key] || "Unknown Address";
}

// Map click event for adding new incident
map.on('click', (e) => {
  const latlng = e.latlng;
  const address = getPredefinedAddress(latlng.lat, latlng.lng);

  L.popup()
    .setLatLng(latlng)
    .setContent(`
      <form class="popup-form" id="incidentForm">
        <h4>Report an Incident</h4>
        <p class="address">Location: ${address}</p>
        <label>Type of Incident</label>
        <select id="incidentType">
          <option>Good Deeds</option>
          <option>Health</option>
          <option>Property Damage</option>
          <option>Violent Crime</option>
          <option>Looting</option>
          <option>Xenophobia</option>
        </select>
        <label>Name</label><input type="text" id="name" required><br>
        <label>Email</label><input type="email" id="email" required><br>
        <label>ID/Passport</label><input type="text" id="idPassport" required><br>
        <label>Phone</label><input type="tel" id="phone" required><br>
        <label>Description</label><textarea id="description"></textarea><br>
        <label>Evidence Image</label><input type="file" id="imageUpload"><br>
        <button type="button" onclick="submitForm(${latlng.lat}, ${latlng.lng}, '${address}')">Submit</button>
      </form>
    `)
    .openOn(map);
});

// Function to handle form submission and add new marker
function submitForm(lat, lng, address) {
  const type = document.getElementById('incidentType').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const icon = icons[type];

  const marker = L.marker([lat, lng], { icon }).addTo(map);
  marker.bindPopup(`
    <strong>${type}</strong><br>
    <em>${date} ${time}</em><br>
    ${description}<br>
    <p>Submitted by: ${name}</p>
    <p>Location: ${address}</p>
  `);
  
  map.closePopup(); // Close form popup after submission
}

