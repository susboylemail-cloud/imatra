// Circuit data structure
const circuits = {
    'KP1': [],
    'KP2': [],
    'KP3': []
};

// Load circuit data from text files
async function loadCircuitData() {
    try {
        // Load each circuit's data
        for (const circuitName in circuits) {
            const response = await fetch(`data/${circuitName}.txt`);
            if (response.ok) {
                const text = await response.text();
                circuits[circuitName] = parseCircuitData(text);
            }
        }
        populateCircuitDropdown();
    } catch (error) {
        console.error('Error loading circuit data:', error);
        // Create sample data if files don't exist
        createSampleData();
        populateCircuitDropdown();
    }
}

// Parse circuit data from text format
function parseCircuitData(text) {
    const lines = text.trim().split('\n');
    const subscribers = [];
    
    for (const line of lines) {
        if (line.trim()) {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length >= 4) {
                subscribers.push({
                    product: parts[0],
                    street: parts[1],
                    number: parts[2],
                    name: parts[3]
                });
            }
        }
    }
    
    return subscribers;
}

// Create sample data for demonstration
function createSampleData() {
    circuits['KP1'] = [
        { product: 'Helsingin Sanomat', street: 'Mannerheimintie', number: '12', name: 'Virtanen Matti' },
        { product: 'Helsingin Sanomat', street: 'Mannerheimintie', number: '14', name: 'Korhonen Anna' },
        { product: 'Aamulehti', street: 'Mannerheimintie', number: '16', name: 'Mäkinen Juha' },
        { product: 'Helsingin Sanomat', street: 'Kaisaniemenkatu', number: '5', name: 'Nieminen Liisa' },
        { product: 'Aamulehti', street: 'Kaisaniemenkatu', number: '7', name: 'Järvinen Pekka' }
    ];
    
    circuits['KP2'] = [
        { product: 'Helsingin Sanomat', street: 'Bulevardi', number: '20', name: 'Saarinen Kaisa' },
        { product: 'Helsingin Sanomat', street: 'Bulevardi', number: '22', name: 'Heikkinen Timo' },
        { product: 'Ilta-Sanomat', street: 'Bulevardi', number: '24', name: 'Laine Arja' },
        { product: 'Aamulehti', street: 'Fredrikinkatu', number: '10', name: 'Koskinen Hannu' },
        { product: 'Helsingin Sanomat', street: 'Fredrikinkatu', number: '12', name: 'Virtanen Sari' },
        { product: 'Ilta-Sanomat', street: 'Fredrikinkatu', number: '14', name: 'Lahtinen Mika' }
    ];
    
    circuits['KP3'] = [
        { product: 'Helsingin Sanomat', street: 'Hämeentie', number: '30', name: 'Nieminen Jari' },
        { product: 'Aamulehti', street: 'Hämeentie', number: '32', name: 'Lehtonen Marko' },
        { product: 'Helsingin Sanomat', street: 'Hämeentie', number: '34', name: 'Rantanen Tuula' },
        { product: 'Helsingin Sanomat', street: 'Sörnäistenkatu', number: '15', name: 'Saari Jukka' }
    ];
}

// Populate the circuit dropdown menu
function populateCircuitDropdown() {
    const select = document.getElementById('circuit-select');
    
    for (const circuitName in circuits) {
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
    
    // Count products
    const productCounts = {};
    subscribers.forEach(subscriber => {
        productCounts[subscriber.product] = (productCounts[subscriber.product] || 0) + 1;
    });
    
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
