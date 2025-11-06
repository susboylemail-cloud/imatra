// Circuit data structure - dynamically populated
const circuits = {};

// Circuit names mapping - maps circuit codes to display names
const circuitNames = {
    'KP2': 'KP2 Puntala-Kurkvuori',
    'KP3': 'KP3 Puntala-Immola',
    'KP4': 'KP4 Rautionkylä',
    'KP7': 'KP7 Kaukopää',
    'KP9': 'KP9 Matara',
    'KP10': 'KP10 Vuoksenniska',
    'KP11': 'KP11 Vuoksenniska',
    'KP12': 'KP12 Vuoksenniska',
    'KP13': 'KP13 Virasoja',
    'KP15': 'KP15 Lakasenpelto',
    'KP16': 'KP16 Kymälahti',
    'KP16B': 'KP16 B Jäppilänniemi',
    'KP17': 'KP17 Karhumäki / Sienimäki',
    'KP18': 'KP18 Sienimäki',
    'KP19': 'KP19 Sienimäki',
    'KP21B': 'KP21 B Vintteri-Sotkulampi',
    'KP22': 'KP22 Tuulikallio-Mansikkala',
    'KP24': 'KP24 Karhumäki-Korvenkanta',
    'KP25': 'KP25 Niskalampi-Tainionsuo',
    'KP26': 'KP26 Mustalampi',
    'KP27': 'KP27 Hosseinlahti',
    'KP28': 'KP28 Karhukallio',
    'KP31': 'KP31 Ritikankoski',
    'KP32A': 'KP32 A Mansikkala',
    'KP32B': 'KP32 B Mansikkala',
    'KP33': 'KP33 Paajala-Pässinniemi',
    'KP34': 'KP34 Imatrankoski',
    'KP36': 'KP36 Imatrankoski',
    'KP37': 'KP37 Onnela',
    'KP38': 'KP38 Liisanpuisto',
    'KP39': 'KP39 Saareksiinmäki',
    'KP40': 'KP40 Saareksiinmäki',
    'KP41': 'KP41 Imatrankoski',
    'KP42': 'KP42 Meltola',
    'KP43B': 'KP43 B Meltola-Räikkölä',
    'KP44': 'KP44 Korvenkylä-Pellisenranta',
    'KP46': 'KP46 Korvenkylä-Rauha',
    'KP47': 'KP47 Tiuruniemi',
    'KP48': 'KP48 Mäentaus',
    'KP49': 'KP49 Rajapatsas',
    'KP51': 'KP51 Savikanta',
    'KP53': 'KP53 Jakola-Kupari',
    'KP54': 'KP54 Itä-Siitola - Pistetalot',
    'KP55': 'KP55 Linnasuo',
    'KP55A': 'KP55 Linnasuo',
    'KP55B': 'KP55 B Viraskorpi',
    'KPR1': 'KP R1 Rasila',
    'KPR2': 'KP R2 Immolan saha',
    'KPR3': 'KP R3 Vennonmäki-Kirkonkylä',
    'KPR4': 'KP R4 Salosaari',
    'KPR5': 'KP R5 Rasila',
    'KPR6': 'KP R6 Virmutjoki'
};

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
        // KPR circuits go to the bottom
        const isKPRA = a.startsWith('KPR');
        const isKPRB = b.startsWith('KPR');
        
        if (isKPRA && !isKPRB) return 1;
        if (!isKPRA && isKPRB) return -1;
        
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
        // Use full name if available, otherwise use circuit code
        option.textContent = circuitNames[circuitName] || circuitName;
        select.appendChild(option);
    }
    
    select.addEventListener('change', handleCircuitChange);
}

// Handle circuit selection change
function handleCircuitChange(event) {
    const selectedCircuit = event.target.value;
    
    if (selectedCircuit && circuits[selectedCircuit]) {
        currentCircuit = selectedCircuit;
        displayCoverSheet(selectedCircuit, circuits[selectedCircuit]);
        displaySubscribers(circuits[selectedCircuit]);
        
        // Restore circuit status if it was already started
        const circuitStatus = getCircuitStatus(selectedCircuit);
        if (circuitStatus.status === 'in-progress') {
            // Restore start time display
            const startBtn = document.getElementById('start-route-btn');
            const timeDisplay = document.getElementById('route-time-display');
            const endBtn = document.getElementById('end-route-btn');
            
            startBtn.disabled = true;
            startBtn.textContent = 'Reitti aloitettu';
            timeDisplay.textContent = `Aloitusaika: ${circuitStatus.startTime}`;
            timeDisplay.classList.remove('hidden');
            endBtn.classList.remove('hidden');
        } else if (circuitStatus.status === 'completed') {
            // Show completed status
            const startBtn = document.getElementById('start-route-btn');
            const timeDisplay = document.getElementById('route-time-display');
            const endBtn = document.getElementById('end-route-btn');
            const routeSummary = document.getElementById('route-summary');
            
            startBtn.disabled = true;
            startBtn.textContent = 'Reitti aloitettu';
            timeDisplay.textContent = `Aloitusaika: ${circuitStatus.startTime}`;
            timeDisplay.classList.remove('hidden');
            
            endBtn.disabled = true;
            endBtn.textContent = 'Reitti valmis';
            endBtn.classList.remove('hidden');
            
            routeSummary.innerHTML = `
                <div>Lopetusaika: ${circuitStatus.endTime}</div>
            `;
            routeSummary.classList.remove('hidden');
        } else {
            resetRouteTracking();
        }
    } else {
        currentCircuit = null;
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
    
    // Display current date and weekday
    const dateDisplay = document.getElementById('date-display');
    const now = new Date();
    const weekdays = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
    const weekday = weekdays[now.getDay()];
    const dateStr = now.toLocaleDateString('fi-FI');
    dateDisplay.textContent = `${weekday} ${dateStr}`;
    
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

// Load delivered addresses from localStorage
function loadDeliveredAddresses() {
    const saved = localStorage.getItem('deliveredAddresses');
    return saved ? JSON.parse(saved) : {};
}

// Save delivered addresses to localStorage
function saveDeliveredAddresses(deliveredAddresses) {
    localStorage.setItem('deliveredAddresses', JSON.stringify(deliveredAddresses));
}

// Get unique key for subscriber
function getSubscriberKey(circuitCode, index) {
    return `${circuitCode}-${index}`;
}

// Display subscriber list
function displaySubscribers(subscribers) {
    const subscriberList = document.getElementById('subscriber-list');
    const subscribersContainer = document.getElementById('subscribers-container');
    
    // Clear previous subscribers
    subscribersContainer.innerHTML = '';
    
    // Load delivered status
    const deliveredAddresses = loadDeliveredAddresses();
    
    // Display each subscriber
    subscribers.forEach((subscriber, index) => {
        const card = document.createElement('div');
        card.className = 'subscriber-card';
        
        // Create checkbox container on the left
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'delivery-checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'delivery-checkbox';
        checkbox.id = `delivery-checkbox-${index}`;
        
        // Check if this address was already delivered
        const subscriberKey = getSubscriberKey(currentCircuit, index);
        if (deliveredAddresses[subscriberKey]) {
            checkbox.checked = true;
            card.classList.add('delivered');
        }
        
        // Add event listener to save state
        checkbox.addEventListener('change', (e) => {
            const deliveredAddresses = loadDeliveredAddresses();
            if (e.target.checked) {
                deliveredAddresses[subscriberKey] = true;
                card.classList.add('delivered');
            } else {
                delete deliveredAddresses[subscriberKey];
                card.classList.remove('delivered');
            }
            saveDeliveredAddresses(deliveredAddresses);
        });
        
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = `delivery-checkbox-${index}`;
        checkboxLabel.className = 'delivery-checkbox-label';
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);
        
        // Content container (address, name, products)
        const contentContainer = document.createElement('div');
        contentContainer.className = 'subscriber-content';
        
        // Address on top (bold) - make it clickable for navigation
        const address = document.createElement('div');
        address.className = 'subscriber-address';
        
        // Create navigation link if there's a next address
        if (index < subscribers.length - 1) {
            const nextSubscriber = subscribers[index + 1];
            const currentAddress = `${subscriber.street} ${subscriber.number}, Imatra, Finland`;
            const nextAddress = `${nextSubscriber.street} ${nextSubscriber.number}, Imatra, Finland`;
            
            const navLink = document.createElement('a');
            navLink.href = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(currentAddress)}&destination=${encodeURIComponent(nextAddress)}&travelmode=driving`;
            navLink.target = '_blank';
            navLink.className = 'address-nav-link';
            navLink.textContent = `${subscriber.street} ${subscriber.number}`;
            navLink.title = `Navigoi seuraavaan: ${nextSubscriber.street} ${nextSubscriber.number}`;
            
            address.appendChild(navLink);
            
            // Add navigation icon (arrow)
            const navIcon = document.createElement('span');
            navIcon.className = 'nav-icon';
            navIcon.textContent = ' →';
            navIcon.title = `Seuraava: ${nextSubscriber.street} ${nextSubscriber.number}`;
            address.appendChild(navIcon);
        } else {
            // Last address - no navigation link
            address.textContent = `${subscriber.street} ${subscriber.number}`;
        }
        
        // Container for name and products
        const nameProductContainer = document.createElement('div');
        nameProductContainer.className = 'subscriber-name-product';
        
        // Name
        const name = document.createElement('span');
        name.className = 'subscriber-name';
        name.textContent = subscriber.name;
        
        // Products container (on the right)
        const productsContainer = document.createElement('div');
        productsContainer.className = 'subscriber-products';
        
        // Split and create badges for each product
        const products = subscriber.product.split(/[,\s]+/).filter(p => p.trim());
        products.forEach(product => {
            const productBadge = document.createElement('span');
            productBadge.className = 'product-badge';
            
            // Normalize product to get color class
            const normalizedProduct = product.replace(/\d+/g, '').trim().replace(/[^\w]/g, '');
            productBadge.classList.add(`product-${normalizedProduct.toLowerCase()}`);
            productBadge.textContent = product;
            
            productsContainer.appendChild(productBadge);
        });
        
        nameProductContainer.appendChild(name);
        nameProductContainer.appendChild(productsContainer);
        
        // Add elements to content container: address first, then name with products
        contentContainer.appendChild(address);
        contentContainer.appendChild(nameProductContainer);
        
        // Add checkbox and content to card
        card.appendChild(checkboxContainer);
        card.appendChild(contentContainer);
        subscribersContainer.appendChild(card);
    });
    
    subscriberList.classList.remove('hidden');
    
    // Apply STF filter if enabled
    const hideSTFToggle = document.getElementById('hide-stf-toggle');
    if (hideSTFToggle && hideSTFToggle.checked) {
        filterSTFProducts();
    }
    
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
let currentCircuit = null;

// Circuit tracking - load from localStorage
function loadCircuitStatus() {
    const savedStatus = localStorage.getItem('circuitStatus');
    return savedStatus ? JSON.parse(savedStatus) : {};
}

// Save circuit status to localStorage
function saveCircuitStatus(status) {
    localStorage.setItem('circuitStatus', JSON.stringify(status));
}

// Get circuit status
function getCircuitStatus(circuitCode) {
    const allStatus = loadCircuitStatus();
    return allStatus[circuitCode] || { status: 'not-started', startTime: null, endTime: null };
}

// Update circuit status
function updateCircuitStatus(circuitCode, status, time = null) {
    const allStatus = loadCircuitStatus();
    
    if (!allStatus[circuitCode]) {
        allStatus[circuitCode] = { status: 'not-started', startTime: null, endTime: null };
    }
    
    allStatus[circuitCode].status = status;
    
    if (status === 'in-progress' && time) {
        allStatus[circuitCode].startTime = time;
    } else if (status === 'completed' && time) {
        allStatus[circuitCode].endTime = time;
    }
    
    saveCircuitStatus(allStatus);
    refreshCircuitTracker();
}

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

// Build circuit tracker display
function buildCircuitTracker() {
    const trackerList = document.getElementById('tracker-list');
    trackerList.innerHTML = '';
    
    // Get all available circuits sorted
    const availableCircuits = ['kp2', 'kp3', 'kp4', 'kp7', 'kp9', 'kp10', 'kp11', 'kp12', 'kp13', 
                                'kp15', 'kp16', 'kp16b', 'kp18', 'kp19', 'kp21b', 'kp22', 'kp24', 
                                'kp25', 'kp26', 'kp27', 'kp28', 'kp31', 'kp32a', 'kp32b', 'kp33', 
                                'kp34', 'kp37', 'kp38', 'kp39', 'kp40', 'kp41', 'kp42', 'kp43b', 
                                'kp44', 'kp46', 'kp47', 'kp48', 'kp49', 'kp51', 'kp53', 'kp54', 
                                'kp55', 'kp55b', 'kpr1', 'kpr2', 'kpr3', 'kpr5', 'kpr6'];
    
    availableCircuits.forEach(circuit => {
        const circuitCode = circuit.toUpperCase();
        const circuitStatus = getCircuitStatus(circuitCode);
        const displayName = circuitNames[circuitCode] || circuitCode;
        
        const trackerItem = document.createElement('div');
        trackerItem.className = 'tracker-item';
        
        // Status indicator
        const statusIndicator = document.createElement('span');
        statusIndicator.className = `status-indicator status-${circuitStatus.status}`;
        
        // Circuit name
        const name = document.createElement('span');
        name.className = 'tracker-circuit-name';
        name.textContent = displayName;
        
        // Time info
        const timeInfo = document.createElement('div');
        timeInfo.className = 'tracker-time-info';
        
        if (circuitStatus.status === 'in-progress' && circuitStatus.startTime) {
            timeInfo.textContent = `Aloitettu: ${circuitStatus.startTime}`;
        } else if (circuitStatus.status === 'completed' && circuitStatus.startTime && circuitStatus.endTime) {
            timeInfo.textContent = `${circuitStatus.startTime} - ${circuitStatus.endTime}`;
        }
        
        trackerItem.appendChild(statusIndicator);
        trackerItem.appendChild(name);
        if (timeInfo.textContent) {
            trackerItem.appendChild(timeInfo);
        }
        
        trackerList.appendChild(trackerItem);
    });
}

// Refresh circuit tracker
function refreshCircuitTracker() {
    buildCircuitTracker();
}

// Start route tracking
function startRoute() {
    routeStartTime = new Date();
    const timeStr = formatTime(routeStartTime);
    
    const startBtn = document.getElementById('start-route-btn');
    const timeDisplay = document.getElementById('route-time-display');
    const endBtn = document.getElementById('end-route-btn');
    
    startBtn.disabled = true;
    startBtn.textContent = 'Reitti aloitettu';
    
    timeDisplay.textContent = `Aloitusaika: ${timeStr}`;
    timeDisplay.classList.remove('hidden');
    
    endBtn.classList.remove('hidden');
    
    // Update circuit status
    if (currentCircuit) {
        updateCircuitStatus(currentCircuit, 'in-progress', timeStr);
    }
}

// End route tracking
function endRoute() {
    routeEndTime = new Date();
    const timeStr = formatTime(routeEndTime);
    
    const endBtn = document.getElementById('end-route-btn');
    const routeSummary = document.getElementById('route-summary');
    
    endBtn.disabled = true;
    endBtn.textContent = 'Reitti valmis';
    
    const duration = calculateDuration(routeStartTime, routeEndTime);
    routeSummary.innerHTML = `
        <div>Lopetusaika: ${timeStr}</div>
        <div>Kokonaisaika: ${duration}</div>
    `;
    routeSummary.classList.remove('hidden');
    
    // Update circuit status
    if (currentCircuit) {
        updateCircuitStatus(currentCircuit, 'completed', timeStr);
    }
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

// Dark mode functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const toggleIcon = darkModeToggle.querySelector('.toggle-icon');
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            toggleIcon.textContent = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggleIcon.textContent = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Tab switching functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Check and reset circuit statuses at midnight
function checkMidnightReset() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
        // It's a new day - reset all circuit statuses and delivered addresses
        console.log('New day detected - resetting all circuit statuses and delivered addresses');
        localStorage.removeItem('circuitStatuses');
        localStorage.removeItem('deliveredAddresses');
        localStorage.setItem('lastResetDate', today);
        
        // Rebuild tracker to show all red statuses
        buildCircuitTracker();
        
        // Refresh current circuit view if one is selected
        if (currentCircuit) {
            const select = document.getElementById('circuit-select');
            const selectedCircuit = select.value;
            if (selectedCircuit && circuits[selectedCircuit]) {
                displaySubscribers(circuits[selectedCircuit]);
            }
        }
    }
}

// Schedule midnight reset check
function scheduleMidnightReset() {
    // Check immediately on load
    checkMidnightReset();
    
    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;
    
    // Schedule reset at midnight
    setTimeout(() => {
        checkMidnightReset();
        // After first midnight, check every 24 hours
        setInterval(checkMidnightReset, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}

// Initialize STF filter toggle
function initSTFFilter() {
    const hideSTFToggle = document.getElementById('hide-stf-toggle');
    
    // Load saved state
    const hideSTF = localStorage.getItem('hideSTF') === 'true';
    hideSTFToggle.checked = hideSTF;
    
    // Apply initial filter state
    if (hideSTF) {
        filterSTFProducts();
    }
    
    // Add event listener
    hideSTFToggle.addEventListener('change', (e) => {
        localStorage.setItem('hideSTF', e.target.checked);
        if (e.target.checked) {
            filterSTFProducts();
        } else {
            showAllProducts();
        }
    });
}

// Filter out STF products from subscriber cards
function filterSTFProducts() {
    const subscriberCards = document.querySelectorAll('.subscriber-card');
    subscriberCards.forEach(card => {
        const productBadges = card.querySelectorAll('.product-badge');
        let hasSTFProduct = false;
        
        productBadges.forEach(badge => {
            const productText = badge.textContent.trim();
            // Normalize product code - remove numbers (e.g., STF2 -> STF)
            const normalizedProduct = productText.replace(/\d+/g, '').trim().replace(/[^\w]/g, '').toUpperCase();
            
            if (normalizedProduct === 'STF') {
                hasSTFProduct = true;
            }
        });
        
        // Hide card if it has ANY STF products
        if (hasSTFProduct) {
            card.classList.add('hidden-stf');
        }
    });
}

// Show all products (remove STF filter)
function showAllProducts() {
    const subscriberCards = document.querySelectorAll('.subscriber-card');
    subscriberCards.forEach(card => {
        card.classList.remove('hidden-stf');
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCircuitData();
    initDarkMode();
    initTabs();
    buildCircuitTracker();
    scheduleMidnightReset();
    initSTFFilter();
    
    // Add event listeners for route tracking
    document.getElementById('start-route-btn').addEventListener('click', startRoute);
    document.getElementById('end-route-btn').addEventListener('click', endRoute);
});
