// Circuit data structure - dynamically populated
const circuits = {};

// List of all available circuits
const availableCircuits = [
    'KP2', 'kp3', 'kp4', 'kp7', 'kp9', 'kp10', 'kp11', 'kp12', 
    'kp15', 'kp16', 'kp16b', 'kp18', 'kp19', 'kp21b', 'kp22', 
    'kp24', 'kp25', 'kp26', 'kp27', 'kp28', 'kp31', 'kp32a', 
    'kp32b', 'kp33', 'kp34', 'kp37', 'kp38', 'kp39', 'kp40', 
    'kp41', 'kp42', 'kp43b', 'kp44', 'kp46', 'kp47', 'kp48', 
    'kp51', 'kp53', 'kp54', 'kp55a', 'kp55b', 'kpr1', 'kpr2', 
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
                subscribers.push({
                    product: parts[4], // Merkinnät (product codes)
                    street: parts[1],  // Katu
                    number: parts[2],  // Osoite (full address)
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
    
    // Count products using reduce for better performance
    const productCounts = subscribers.reduce((counts, subscriber) => {
        counts[subscriber.product] = (counts[subscriber.product] || 0) + 1;
        return counts;
    }, {});
    
    // Update circuit name
    circuitNameElement.textContent = circuitName;
    
    // Clear previous summary
    productSummary.innerHTML = '';
    
    // Display product counts
    for (const [product, count] of Object.entries(productCounts)) {
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
        
        const product = document.createElement('div');
        product.className = 'subscriber-product';
        product.textContent = subscriber.product;
        
        const address = document.createElement('div');
        address.className = 'subscriber-address';
        address.textContent = `${subscriber.street} ${subscriber.number}`;
        
        const name = document.createElement('div');
        name.className = 'subscriber-name';
        name.textContent = subscriber.name;
        
        card.appendChild(product);
        card.appendChild(address);
        card.appendChild(name);
        subscribersContainer.appendChild(card);
    });
    
    subscriberList.classList.remove('hidden');
}

// Hide cover sheet
function hideCoverSheet() {
    document.getElementById('cover-sheet').classList.add('hidden');
}

// Hide subscriber list
function hideSubscribers() {
    document.getElementById('subscriber-list').classList.add('hidden');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCircuitData();
});
