// Initialize the map and set its view to a given center and zoom level
const map = L.map('map').setView([39.8283, -98.5795], 4); // Centered over the US

// Load a tile layer for the base map (OpenStreetMap in this case)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Array of years for the timestamps
const years = ['2024', '2020', '2015', '2010', '2005', '2000', '1995'];

// Sample data for 15 suburbs with coordinates and population values for 7 timestamps
const data = [
    { name: "Mesa, AZ", coords: [33.4152, -111.8315], values: [509475, 504258, 484587, 439041, 396375, 396375, 347394] },
    { name: "Plano, TX", coords: [33.0198, -96.6989], values: [290850, 287677, 282181, 259841, 222030, 222030, 188022] },
    { name: "Irvine, CA", coords: [33.6846, -117.8265], values: [331260, 307670, 250384, 212375, 175767, 143072, 110330] },
    { name: "Aurora, CO", coords: [39.7294, -104.8319], values: [386261, 379434, 361710, 325078, 276393, 276393, 222103] },
    { name: "Henderson, NV", coords: [36.0395, -114.9817], values: [335484, 320189, 285667, 257729, 175381, 175381, 130532] },
    { name: "Naperville, IL", coords: [41.7508, -88.1535], values: [149540, 148304, 144864, 141853, 128358, 128358, 100422] },
    { name: "Arlington, VA", coords: [38.87997, -77.10677], values: [238643, 236842, 229164, 207627, 189453, 189453, 171878] },
    { name: "Bellevue, WA", coords: [47.6101, -122.2015], values: [153007, 148164, 133992, 122363, 109569, 109569, 86072] },
    { name: "Pearland, TX", coords: [29.5636, -95.2860], values: [125817, 122460, 108821, 91252, 57055, 37064, 18702] },
    { name: "Overland Park, KS", coords: [38.9822, -94.6708], values: [202012, 197238, 186515, 173372, 149080, 149080, 111790] },
    { name: "Santa Clara, CA", coords: [37.3541, -121.9552], values: [135965, 131450, 116468, 108518, 102361, 93187, 87257] },
    { name: "Hialeah, FL", coords: [25.8576, -80.2781], values: [223109, 233339, 224382, 218896, 209971, 197000, 187073] },
    { name: "Carmel, IN", coords: [39.9784, -86.1180], values: [104918, 101068, 86547, 79191, 68889, 65000, 59500] },
    { name: "Marietta, GA", coords: [33.9526, -84.5499], values: [62857, 60686, 58338, 56179, 51086, 48472, 44279] },
    { name: "St. Paul, MN", coords: [44.9537, -93.09], values: [311527, 304442, 285068, 275150, 287151, 287151, 272235] }
];

// Create an array of circle markers to manipulate later
let markers = [];

// Function to update the map with data for a specific timestamp and adjust based on zoom level
function updateMap(timestampIndex) {
    const zoomLevel = map.getZoom(); // Get the current zoom level
    const scaleFactor = 15 / zoomLevel; // Adjust scale based on zoom level, you can tweak the 15 value

    // Clear previous markers from the map
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset marker array

    // Add new markers based on the selected timestamp
    data.forEach(city => {
        const value = city.values[timestampIndex];
        const formattedValue = value.toLocaleString(); // Format population value with commas

        const marker = L.circle(city.coords, {
            color: 'blue',
            radius: Math.sqrt(value) * 50 * scaleFactor, // Adjust size proportional to population and zoom level
            fillOpacity: 0.5
        }).addTo(map).bindPopup(`${city.name}: ${formattedValue}`); // Display formatted value

        markers.push(marker); // Store the marker in the array
    });
}

// Event listener to update the map when the time slider changes
document.getElementById('timeSlider').addEventListener('input', (event) => {
    const timestampIndex = event.target.value;
    document.getElementById('timeDisplay').textContent = `Timestamp: ${years[timestampIndex]}`;
    updateMap(timestampIndex);
});

// Initialize the map with the first timestamp (2024)
document.getElementById('timeDisplay').textContent = `Timestamp: ${years[0]}`; // Initialize with 2024
updateMap(0);

// Add a custom control for the legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    
    // Add content and style to the legend
    div.innerHTML += `<h4 style="margin: 0 0 5px;">Population Size</h4>`;
    div.innerHTML += `
        <i style="background: blue; width: 18px; height: 18px; display: inline-block; margin-right: 5px; border-radius: 50%;"></i>
        Larger circles indicate larger populations.`;
    
    // Styling the legend
    div.style.padding = '10px'; // Add padding
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white background
    div.style.borderRadius = '5px'; // Rounded corners
    div.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)'; // Subtle shadow
    div.style.fontSize = '14px'; // Set font size for readability

    return div;
};

legend.addTo(map);

// Event listener to update the circles when the map is zoomed. This is my fifth custom interaction
map.on('zoomend', function() {
    const currentTimestampIndex = document.getElementById('timeSlider').value; // Get the current timestamp index
    updateMap(currentTimestampIndex); // Update map with current timestamp
});


