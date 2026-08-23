// Catalog Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.js-catalog-grid');
    if (!grid) return;

    let products = getProducts();
    let currentFiltered = [...products];

    // DOM Elements
    const resultsCount = document.querySelector('.js-results-count');
    const sortSelect = document.querySelector('.js-sort');
    const categoryFilters = document.querySelectorAll('.js-filter-category');
    const priceFilters = document.querySelectorAll('.js-filter-price');

    // Parse URL params for initial category/search filter
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    const urlQuery = urlParams.get('q');

    if (urlCategory) {
        currentFiltered = currentFiltered.filter(p => p.category === urlCategory);
        categoryFilters.forEach(cb => {
            if (cb.value === urlCategory) cb.checked = true;
        });
    }

    if (urlQuery) {
        const query = urlQuery.toLowerCase();
        currentFiltered = currentFiltered.filter(p => 
            p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
    }

    function renderCatalog() {
        grid.innerHTML = currentFiltered.map(createProductCard).join('');
        resultsCount.textContent = currentFiltered.length;
        
        // Attach event listeners for Add to Cart
        const buttons = grid.querySelectorAll('.js-add-to-cart');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    addToCart(product);
                }
            });
        });
    }

    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem(STORE_KEYS.CART)) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
        updateCartIcon(cart);
        alert(`${product.title} añadido al carrito!`);
    }

    function applyFilters() {
        currentFiltered = [...products];
        
        // Category Filter
        const selectedCategories = Array.from(categoryFilters).filter(cb => cb.checked).map(cb => cb.value);
        if (selectedCategories.length > 0) {
            currentFiltered = currentFiltered.filter(p => selectedCategories.includes(p.category));
        }

        // Price Filter
        const selectedPrice = Array.from(priceFilters).find(radio => radio.checked).value;
        if (selectedPrice !== 'all') {
            currentFiltered = currentFiltered.filter(p => {
                if (selectedPrice === '0-50') return p.price <= 50;
                if (selectedPrice === '50-200') return p.price > 50 && p.price <= 200;
                if (selectedPrice === '200+') return p.price > 200;
                return true;
            });
        }
        
        applySorting();
    }

    function applySorting() {
        const sortVal = sortSelect.value;
        if (sortVal === 'price-asc') {
            currentFiltered.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'price-desc') {
            currentFiltered.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'name-asc') {
            currentFiltered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            // featured (default order by id)
            currentFiltered.sort((a, b) => a.id - b.id);
        }
        
        renderCatalog();
    }

    // Event Listeners
    categoryFilters.forEach(cb => cb.addEventListener('change', applyFilters));
    priceFilters.forEach(radio => radio.addEventListener('change', applyFilters));
    sortSelect.addEventListener('change', applySorting);

    // Initial render
    applySorting();
});

// Shared card renderer
function createProductCard(product) {
    return `
        <article class="c-product-card">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}" class="c-product-card__image">
            </a>
            <a href="product.html?id=${product.id}">
                <h3 class="c-product-card__title">${product.title}</h3>
            </a>
            <p class="c-product-card__price">$${product.price.toFixed(2)}</p>
            <button class="c-button c-button--primary c-product-card__btn js-add-to-cart" data-id="${product.id}">
                Añadir al Carrito
            </button>
        </article>
    `;
}
