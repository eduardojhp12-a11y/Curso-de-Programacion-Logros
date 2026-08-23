// Cart Page Logic

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const container = document.querySelector('.js-cart-container');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 100px 20px;">
                <h2>Tu carrito de Marketplace está vacío</h2>
                <p style="margin-bottom: 20px; color: var(--color-text-secondary);">Descubre productos increíbles en nuestro catálogo.</p>
                <a href="catalog.html" class="c-button c-button--primary">Explorar productos</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartItemsHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <article class="c-cart-item">
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="c-cart-item__image">
                </a>
                <div class="c-cart-item__details">
                    <a href="product.html?id=${item.id}"><h3 class="c-cart-item__title">${item.title}</h3></a>
                    <p class="c-cart-item__price">$${item.price.toFixed(2)}</p>
                    <p style="color: var(--color-success); font-size: 0.875rem;">En Stock</p>
                    
                    <div class="c-cart-item__actions">
                        <div class="c-quantity" style="margin-bottom: 0;">
                            <button class="c-quantity__btn js-cart-minus" data-id="${item.id}">-</button>
                            <input type="text" readonly class="c-quantity__input" value="${item.quantity}">
                            <button class="c-quantity__btn js-cart-plus" data-id="${item.id}">+</button>
                        </div>
                        <span style="color: var(--color-border);">|</span>
                        <button class="c-cart-item__delete js-cart-delete" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    container.innerHTML = `
        <div class="c-cart-list">
            <h2 style="font-size: 1.75rem; margin-bottom: var(--space-3); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                Carrito de Compras
            </h2>
            ${cartItemsHTML}
        </div>
        <aside class="c-summary-card">
            <h3 class="c-summary-card__title">Resumen del pedido</h3>
            <div class="c-summary-card__row">
                <span>Subtotal (${totalItems} productos):</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="c-summary-card__row">
                <span>Envío:</span>
                <span style="color: var(--color-success);">Gratis</span>
            </div>
            <div class="c-summary-card__total">
                <span>Total:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="c-button c-button--primary c-button--large" style="width: 100%;">Proceder al pago</a>
        </aside>
    `;

    attachCartEvents();
}

function attachCartEvents() {
    const minusBtns = document.querySelectorAll('.js-cart-minus');
    const plusBtns = document.querySelectorAll('.js-cart-plus');
    const deleteBtns = document.querySelectorAll('.js-cart-delete');

    minusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateItemQuantity(parseInt(e.target.dataset.id), -1);
        });
    });

    plusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateItemQuantity(parseInt(e.target.dataset.id), 1);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteItem(parseInt(e.target.dataset.id));
        });
    });
}

function updateItemQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            deleteItem(id);
            return;
        }
        saveCart(cart);
        renderCartPage();
    }
}

function deleteItem(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCartPage();
}
