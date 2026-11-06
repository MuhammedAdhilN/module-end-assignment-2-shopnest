let products = [];
let cart = JSON.parse(localStorage.getItem('shopnest_cart')) || [];
let currentCategory = 'All';
let searchQuery = '';

const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.cat-btn');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const noResultMsg = document.getElementById('noResultMsg');

function loadProducts() {
    products = [
        { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1999, originalPrice: 2999, rating: 4.5, imageUrl: "images/headphone.jpg" },
        { id: 2, name: "Smart Watch", category: "Electronics", price: 2499, originalPrice: 3999, rating: 4.2, imageUrl: "images/smartwatch.jpg" },
        { id: 3, name: "Casual T-Shirt", category: "Clothing", price: 499, originalPrice: 999, rating: 4.0, imageUrl: "images/tshirt.jpg" },
        { id: 4, name: "Denim Jacket", category: "Clothing", price: 1499, originalPrice: 2499, rating: 4.6, imageUrl: "images/jacket.jpg" },
        { id: 5, name: "Running Shoes", category: "Footwear", price: 1799, originalPrice: 2999, rating: 4.3, imageUrl: "images/shoes.jpg" },
        { id: 6, name: "Formal Leather Shoes", category: "Footwear", price: 2199, originalPrice: 3499, rating: 4.4, imageUrl: "images/leather shoes.jpg" },
        { id: 7, name: "JavaScript Guidebook", category: "Books", price: 599, originalPrice: 899, rating: 4.8, imageUrl: "images/guide book js.jpg" },
        { id: 8, name: "Atomic Habits", category: "Books", price: 450, originalPrice: 799, rating: 4.9, imageUrl: "images/atomic.jpg" },
        { id: 9, name: "Bluetooth Speaker", category: "Electronics", price: 1299, originalPrice: 1999, rating: 4.1, imageUrl: "images/speaker.jpg" },
        { id: 10, name: "Cotton Hoodie", category: "Clothing", price: 999, originalPrice: 1599, rating: 4.5, imageUrl: "images/cotton hoodie.jpg" },
        { id: 11, name: "Sports Sandals", category: "Footwear", price: 799, originalPrice: 1299, rating: 3.9, imageUrl: "images/sports sandals.jpg" },
        { id: 12, name: "Python Programming", category: "Books", price: 650, originalPrice: 999, rating: 4.7, imageUrl: "images/python.jpg" }
    ];
    displayProducts(products);
}

function displayProducts(items) {
    productContainer.innerHTML = '';
    
    if (items.length === 0) {
        noResultMsg.classList.remove('hidden');
        return;
    } else {
        noResultMsg.classList.add('hidden');
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">
                <span class="new">₹${product.price}</span>
                <span class="old">₹${product.originalPrice}</span>
            </div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(card);
    });
}

function filterProducts() {
    let filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'All' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    displayProducts(filtered);
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterProducts();
});

categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        filterProducts();
    });
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    updateCart();
}

function updateCart() {
    localStorage.setItem('shopnest_cart', JSON.stringify(cart));
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-details">
                <div><strong>${item.name}</strong></div>
                <div>₹${item.price} x ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = totalPrice;
}

cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

loadProducts();
updateCart();