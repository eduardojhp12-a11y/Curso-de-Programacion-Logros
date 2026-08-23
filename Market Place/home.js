// Initialize Home Page Logic
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    renderProducts();
});

// Carousel Logic
function initCarousel() {
    const track = document.querySelector('.js-carousel-track');
    const prevBtn = document.querySelector('.js-carousel-prev');
    const nextBtn = document.querySelector('.js-carousel-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = Array.from(track.children);
    let currentIndex = 0;
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    // Auto-advance every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }, 5000);
}

// Render Products
function renderProducts() {
    const featuredContainer = document.querySelector('.js-featured-products');
    const recentContainer = document.querySelector('.js-recent-products');
    const products = getProducts();
    
    if (featuredContainer) {
        // Show first 4 items as featured
        featuredContainer.innerHTML = products.slice(0, 4).map(createProductCard).join('');
        attachAddToCartEvents(featuredContainer, products);
    }
    
    if (recentContainer) {
        // Show last 4 items as recently viewed
        recentContainer.innerHTML = products.slice(4, 8).map(createProductCard).join('');
        attachAddToCartEvents(recentContainer, products);
    }
}

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
                addToCart(product);
            }
        });
    });
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart(cart);
    alert(`${product.title} añadido al carrito!`);
}
