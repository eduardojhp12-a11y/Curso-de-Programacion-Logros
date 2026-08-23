// Category Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type') || 'electronics';

    const banner = document.getElementById('cat-banner');
    const grid = document.querySelector('.js-category-products');
    const titleEl = document.getElementById('cat-title');

    // Category Metadata
    const catMeta = {
        'electronics': {
            title: 'Mundo Tech 2026',
            desc: 'Descubre los dispositivos más avanzados del mercado.',
            color: '#131921'
        },
        'clothing': {
            title: 'Tendencias de Moda',
            desc: 'Renueva tu estilo con la nueva colección de temporada.',
            color: '#8e44ad'
        },
        'home': {
            title: 'Tu Hogar Ideal',
            desc: 'Muebles y decoración para espacios únicos.',
            color: '#27ae60'
        }
    };

    const meta = catMeta[categoryType] || { title: 'Categoría Destacada', desc: 'Los mejores productos.', color: '#34495e' };

    // Render Banner
    banner.style.backgroundColor = meta.color;
    banner.innerHTML = `
        <h1 class="c-category-banner__title">${meta.title}</h1>
        <p class="c-category-banner__desc">${meta.desc}</p>
        <a href="catalog.html?category=${categoryType}" class="c-button c-button--primary" style="margin-top: 20px;">Ver catálogo completo</a>
    `;

    // Render Products
    const products = getProducts().filter(p => p.category === categoryType);
    titleEl.textContent = `Top Ventas en ${meta.title}`;
    
    if (products.length > 0) {
        grid.innerHTML = products.map(createProductCard).join('');
        attachAddToCartEvents(grid, products);
    } else {
        grid.innerHTML = `<p>No hay productos disponibles en esta categoría.</p>`;
    }
});

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

function attachAddToCartEvents(container, products) {
    const buttons = container.querySelectorAll('.js-add-to-cart');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
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
        });
    });
}
