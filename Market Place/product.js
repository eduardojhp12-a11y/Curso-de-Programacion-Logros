// Product Detail Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `<h2>Producto no encontrado</h2><a href="catalog.html" class="c-button c-button--primary">Volver al catálogo</a>`;
        return;
    }

    document.title = `${product.title} - Marketplace`;

    renderProduct(product);
});

function renderProduct(product) {
    const container = document.getElementById('product-container');
    
    // Simulate extra images
    const images = [
        product.image,
        product.image.replace('300x300', '300x301'),
        product.image.replace('300x300', '300x302')
    ];

    container.innerHTML = `
        <div class="c-gallery">
            <img src="${images[0]}" alt="${product.title}" class="c-gallery__main js-main-img">
            <div class="c-gallery__thumbnails">
                ${images.map((img, i) => `
                    <img src="${img}" alt="Thumbnail ${i}" class="c-gallery__thumb js-thumb ${i===0?'c-gallery__thumb--active':''}" data-src="${img}">
                `).join('')}
            </div>
        </div>
        
        <div class="product-info">
            <h1 class="product-info__title">${product.title}</h1>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-2);">Marca: <a href="catalog.html?q=${product.brand}" style="color: var(--color-primary);">${product.brand}</a></p>
            <p class="product-info__price">$${product.price.toFixed(2)}</p>
            
            <p class="product-info__description">
                Este es un producto de alta calidad, diseñado para satisfacer todas tus necesidades. 
                Construido con materiales duraderos y tecnología de punta, asegurando un rendimiento óptimo en cualquier situación.
            </p>

            <div class="c-quantity">
                <label for="qty" style="font-weight: 500;">Cantidad:</label>
                <button class="c-quantity__btn js-qty-minus">-</button>
                <input type="number" id="qty" class="c-quantity__input js-qty-input" value="1" min="1" max="10">
                <button class="c-quantity__btn js-qty-plus">+</button>
            </div>

            <button class="c-button c-button--primary c-button--large js-add-to-cart" style="width: 100%; max-width: 300px;">
                Añadir al Carrito
            </button>
        </div>
    `;

    attachEvents(product);
}

function attachEvents(product) {
    // Gallery Logic
    const mainImg = document.querySelector('.js-main-img');
    const thumbs = document.querySelectorAll('.js-thumb');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            mainImg.src = e.target.dataset.src;
            thumbs.forEach(t => t.classList.remove('c-gallery__thumb--active'));
            e.target.classList.add('c-gallery__thumb--active');
        });
    });

    // Quantity Logic
    const input = document.querySelector('.js-qty-input');
    const minusBtn = document.querySelector('.js-qty-minus');
    const plusBtn = document.querySelector('.js-qty-plus');

    minusBtn.addEventListener('click', () => {
        if (input.value > 1) input.value = parseInt(input.value) - 1;
    });

    plusBtn.addEventListener('click', () => {
        if (input.value < 10) input.value = parseInt(input.value) + 1;
    });

    // Add to Cart
    const addBtn = document.querySelector('.js-add-to-cart');
    addBtn.addEventListener('click', () => {
        const qty = parseInt(input.value);
        addToCart(product, qty);
    });
}

function addToCart(product, quantity) {
    const cart = JSON.parse(localStorage.getItem(STORE_KEYS.CART)) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    updateCartIcon(cart);
    alert(`${quantity} x ${product.title} añadido al carrito!`);
}
