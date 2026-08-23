// Global functionality: Cart state, user session, and common UI logic

const STORE_KEYS = {
    CART: 'marketplace_cart',
    USER: 'marketplace_user',
    PRODUCTS: 'marketplace_products'
};

// Initialize app state
function initApp() {
    initCart();
    initUserSession();
}

// Cart Logic
function initCart() {
    const cart = getCart();
    updateCartIcon(cart);
}

function getCart() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.CART)) || [];
}

function saveCart(cart) {
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    updateCartIcon(cart);
}

function updateCartIcon(cart) {
    const cartCountEl = document.querySelector('.js-cart-count');
    if (cartCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        if (totalItems > 0) {
            cartCountEl.style.display = 'flex';
        } else {
            cartCountEl.style.display = 'none';
        }
    }
}

// User Session Logic
function initUserSession() {
    const user = getUser();
    updateHeaderAuthUI(user);
}

function getUser() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.USER)) || null;
}

function updateHeaderAuthUI(user) {
    const authLink = document.querySelector('.js-auth-link');
    if (authLink) {
        const line1 = authLink.querySelector('.header__action-text--small');
        const line2 = authLink.querySelector('.header__action-text--bold');
        
        if (user) {
            line1.textContent = `Hola, ${user.name.split(' ')[0]}`;
            line2.textContent = 'Mi Cuenta';
            authLink.href = 'dashboard.html';
        } else {
            line1.textContent = 'Hola, Identifícate';
            line2.textContent = 'Cuentas y Pedidos';
            authLink.href = 'login.html';
        }
    }
}

// Run initialization on DOM load
document.addEventListener('DOMContentLoaded', initApp);
