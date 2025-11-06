// Circuit data structure - dynamically populated
const circuits = {};

// List of all available circuits
const availableCircuits = [
    'KP2', 'kp3', 'kp4', 'kp7', 'kp9', 'kp10', 'kp11', 'kp12', 
    'kp13', 'kp15', 'kp16', 'kp16b', 'kp18', 'kp19', 'kp21b', 'kp22', 
    'kp24', 'kp25', 'kp26', 'kp27', 'kp28', 'kp31', 'kp32a', 
    'kp32b', 'kp33', 'kp34', 'kp37', 'kp38', 'kp39', 'kp40', 
    'kp41', 'kp42', 'kp43b', 'kp44', 'kp46', 'kp47', 'kp48', 
    'kp49', 'kp51', 'kp53', 'kp54', 'kp55a', 'kp55b', 'kpr1', 'kpr2', 
    'kpr3', 'kpr5', 'kpr6'
];

// Load circuit data from text files
async function loadCircuitData() {
    try {
        // Load each circuit's data
        for (const circuitName of availableCircuits) {
            const response = await fetch(`data/${circuitName}.txt`);
            if (response.ok) {
                const text = await response.text();
                circuits[circuitName.toUpperCase()] = parseCircuitData(text);
            } else {
                console.warn(`Failed to load ${circuitName}.txt: ${response.status} ${response.statusText}`);
            }
        }
        populateCircuitDropdown();
    } catch (error) {
        console.error('Error loading circuit data files:', error.message);
        populateCircuitDropdown();
    }
}

// Parse CSV data with proper quote handling
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Parse circuit data from CSV format
function parseCircuitData(text) {
    const lines = text.trim().split('\n');
    const subscribers = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = parseCSVLine(line);
            // CSV format: "Sivu","Katu","Osoite","Nimi","Merkinnät"
            if (parts.length >= 5) {
                const street = parts[1];  // Katu
                const fullAddress = parts[2];  // Osoite (full address)
                
                // Extract just the number from the address by removing the street name if it's duplicated
                let addressNumber = fullAddress;
                if (fullAddress.startsWith(street + ' ')) {
                    addressNumber = fullAddress.substring(street.length + 1);
                }
                
                subscribers.push({
                    product: parts[4], // Merkinnät (product codes)
                    street: street,
                    number: addressNumber,
                    name: parts[3]     // Nimi
                });
            }
        }
    }
    
    return subscribers;
}

// Populate the circuit dropdown menu
function populateCircuitDropdown() {
    const select = document.getElementById('circuit-select');
    
    // Sort circuits for better user experience
    const sortedCircuits = Object.keys(circuits).sort((a, b) => {
        // Extract numbers from circuit names for proper sorting
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        
        // Sort by number first, then alphabetically
        if (numA !== numB) {
            return numA - numB;
        }
        return a.localeCompare(b);
    });
    
    for (const circuitName of sortedCircuits) {
        const option = document.createElement('option');
        option.value = circuitName;
        option.textContent = circuitName;
        select.appendChild(option);
    }
    
    select.addEventListener('change', handleCircuitChange);
}

// Handle circuit selection change
function handleCircuitChange(event) {
    const selectedCircuit = event.target.value;
    
    if (selectedCircuit && circuits[selectedCircuit]) {
        displayCoverSheet(selectedCircuit, circuits[selectedCircuit]);
        displaySubscribers(circuits[selectedCircuit]);
    } else {
        hideCoverSheet();
        hideSubscribers();
    }
}

// Display cover sheet with product summary
function displayCoverSheet(circuitName, subscribers) {
    const coverSheet = document.getElementById('cover-sheet');
    const circuitNameElement = document.getElementById('circuit-name');
    const productSummary = document.getElementById('product-summary');
    
    // Count individual products, splitting combinations
    const productCounts = {};
    
    subscribers.forEach(subscriber => {
        // Split product codes by comma and space to handle all combinations
        const products = subscriber.product.split(/[,\s]+/).map(p => p.trim());
        products.forEach(product => {
            if (product) {
                // Normalize product codes - remove numbers (e.g., UV2 -> UV, HS2 -> HS, ES4 -> ES)
                let normalizedProduct = product.replace(/\d+/g, '').trim();
                // Remove any remaining special characters
                normalizedProduct = normalizedProduct.replace(/[^\w]/g, '');
                
                if (normalizedProduct) {
                    productCounts[normalizedProduct] = (productCounts[normalizedProduct] || 0) + 1;
                }
            }
        });
    });
    
    // Update circuit name
    circuitNameElement.textContent = circuitName;
    
    // Clear previous summary
    productSummary.innerHTML = '';
    
    // Sort products alphabetically for consistent display
    const sortedProducts = Object.entries(productCounts).sort((a, b) => a[0].localeCompare(b[0]));
    
    // Display product counts
    for (const [product, count] of sortedProducts) {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        const productName = document.createElement('span');
        productName.className = 'product-name';
        productName.textContent = product;
        
        const productCount = document.createElement('span');
        productCount.className = 'product-count';
        productCount.textContent = count;
        
        productItem.appendChild(productName);
        productItem.appendChild(productCount);
        productSummary.appendChild(productItem);
    }
    
    coverSheet.classList.remove('hidden');
    
    // Reset route tracking UI for new circuit
    resetRouteTracking();
}

// Display subscriber list
function displaySubscribers(subscribers) {
    const subscriberList = document.getElementById('subscriber-list');
    const subscribersContainer = document.getElementById('subscribers-container');
    
    // Clear previous subscribers
    subscribersContainer.innerHTML = '';
    
    // Display each subscriber
    subscribers.forEach(subscriber => {
        const card = document.createElement('div');
        card.className = 'subscriber-card';
        
        // Address on top (bold)
        const address = document.createElement('div');
        address.className = 'subscriber-address';
        address.textContent = `${subscriber.street} ${subscriber.number}`;
        
        // Name with product code
        const nameWithProduct = document.createElement('div');
        nameWithProduct.className = 'subscriber-name';
        nameWithProduct.textContent = `${subscriber.name} ${subscriber.product}`;
        
        // Add elements in new order: address first, then name with product
        card.appendChild(address);
        card.appendChild(nameWithProduct);
        subscribersContainer.appendChild(card);
    });
    
    subscriberList.classList.remove('hidden');
    
    // Show end route button if route has been started
    if (routeStartTime && !routeEndTime) {
        document.getElementById('end-route-btn').classList.remove('hidden');
    }
}

// Hide cover sheet
function hideCoverSheet() {
    document.getElementById('cover-sheet').classList.add('hidden');
}

// Hide subscriber list
function hideSubscribers() {
    document.getElementById('subscriber-list').classList.add('hidden');
}

// Route tracking variables
let routeStartTime = null;
let routeEndTime = null;

// Format time for display
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Calculate duration in minutes
function calculateDuration(startTime, endTime) {
    const diff = endTime - startTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

// Start route tracking
function startRoute() {
    routeStartTime = new Date();
    
    const startBtn = document.getElementById('start-route-btn');
    const timeDisplay = document.getElementById('route-time-display');
    const endBtn = document.getElementById('end-route-btn');
    
    startBtn.disabled = true;
    startBtn.textContent = 'Reitti aloitettu';
    
    timeDisplay.textContent = `Aloitusaika: ${formatTime(routeStartTime)}`;
    timeDisplay.classList.remove('hidden');
    
    endBtn.classList.remove('hidden');
}

// End route tracking
function endRoute() {
    routeEndTime = new Date();
    
    const endBtn = document.getElementById('end-route-btn');
    const routeSummary = document.getElementById('route-summary');
    
    endBtn.disabled = true;
    endBtn.textContent = 'Reitti valmis';
    
    const duration = calculateDuration(routeStartTime, routeEndTime);
    routeSummary.innerHTML = `
        <div>Lopetusaika: ${formatTime(routeEndTime)}</div>
        <div>Kokonaisaika: ${duration}</div>
    `;
    routeSummary.classList.remove('hidden');
}

// Reset route tracking UI
function resetRouteTracking() {
    routeStartTime = null;
    routeEndTime = null;
    
    const startBtn = document.getElementById('start-route-btn');
    const timeDisplay = document.getElementById('route-time-display');
    const endBtn = document.getElementById('end-route-btn');
    const routeSummary = document.getElementById('route-summary');
    
    startBtn.disabled = false;
    startBtn.textContent = 'Aloita reitti';
    
    timeDisplay.classList.add('hidden');
    endBtn.classList.add('hidden');
    endBtn.disabled = false;
    endBtn.textContent = 'Reitti valmis';
    routeSummary.classList.add('hidden');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCircuitData();
    
    // Add event listeners for route tracking
    document.getElementById('start-route-btn').addEventListener('click', startRoute);
    document.getElementById('end-route-btn').addEventListener('click', endRoute);
});
