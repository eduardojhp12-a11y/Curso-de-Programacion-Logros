/* ============================================================
   NEXUS STORE — Core Application Module
   Navigation, localStorage cart/wishlist, toast system
   ============================================================ */

const NexusApp = {
    /* ── State ── */
    cart: [],
    wishlist: [],
    user: null,

    /* ── Initialization ── */
    init() {
        this.loadState();
        this.initNavigation();
        this.initMobileMenu();
        this.updateCartBadge();
        this.updateWishlistBadge();
    },

    /* ── LocalStorage Persistence ── */
    loadState() {
        try {
            const cart = localStorage.getItem('nexus_cart');
            const wishlist = localStorage.getItem('nexus_wishlist');
            const user = localStorage.getItem('nexus_user');
            this.cart = cart ? JSON.parse(cart) : [];
            this.wishlist = wishlist ? JSON.parse(wishlist) : [];
            this.user = user ? JSON.parse(user) : null;
        } catch (e) {
            console.warn('Failed to load state from localStorage:', e);
            this.cart = [];
            this.wishlist = [];
            this.user = null;
        }
    },

    saveCart() {
        localStorage.setItem('nexus_cart', JSON.stringify(this.cart));
        this.updateCartBadge();
    },

    saveWishlist() {
        localStorage.setItem('nexus_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistBadge();
    },

    saveUser() {
        localStorage.setItem('nexus_user', JSON.stringify(this.user));
    },

    /* ── Cart Operations ── */
    addToCart(game) {
        const existing = this.cart.find(item => item.id === game.id);
        if (existing) {
            NexusApp.showToast(`"${game.title}" ya está en tu carrito`, 'info');
            return false;
        }
        this.cart.push({
            id: game.id,
            title: game.title,
            price: game.price,
            originalPrice: game.originalPrice,
            coverImage: game.coverImage,
            gradient: game.gradient || null,
            icon: game.icon || null,
            platform: game.platforms ? game.platforms[0] : 'pc',
            quantity: 1
        });
        this.saveCart();
        NexusApp.showToast(`"${game.title}" añadido al carrito`, 'success');
        return true;
    },

    removeFromCart(gameId) {
        this.cart = this.cart.filter(item => item.id !== gameId);
        this.saveCart();
    },

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    /* ── Wishlist Operations ── */
    toggleWishlist(game) {
        const index = this.wishlist.findIndex(item => item.id === game.id);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            NexusApp.showToast(`"${game.title}" eliminado de tu lista de deseados`, 'info');
            return false;
        } else {
            this.wishlist.push({
                id: game.id,
                title: game.title,
                price: game.price,
                originalPrice: game.originalPrice,
                coverImage: game.coverImage,
                gradient: game.gradient || null,
                icon: game.icon || null
            });
            this.saveWishlist();
            NexusApp.showToast(`"${game.title}" añadido a tu lista de deseados`, 'success');
            return true;
        }
    },

    isInWishlist(gameId) {
        return this.wishlist.some(item => item.id === gameId);
    },

    /* ── Badge Updates ── */
    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getCartCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    updateWishlistBadge() {
        const badge = document.getElementById('wishlist-badge');
        if (badge) {
            const count = this.wishlist.length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    /* ── Navigation ── */
    initNavigation() {
        const navLinks = document.querySelectorAll('.header__nav-link, .mobile-nav__link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('header__nav-link--active', 'mobile-nav__link--active');
            }
        });
    },

    /* ── Mobile Menu ── */
    initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (toggle && mobileNav) {
            toggle.addEventListener('click', () => {
                mobileNav.classList.toggle('mobile-nav--open');
                const isOpen = mobileNav.classList.contains('mobile-nav--open');
                toggle.setAttribute('aria-expanded', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        }
    },

    /* ── Toast Notification System ── */
    showToast(message, type = 'info', duration = 3500) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6" stroke-linecap="round"/></svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg>`
        };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast__icon" style="color: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'})">${icons[type] || icons.info}</span>
            <span class="toast__message">${message}</span>
            <button class="toast__close" aria-label="Cerrar notificación">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
            </button>
        `;

        toast.querySelector('.toast__close').addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 200);
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transition = 'opacity 300ms, transform 300ms';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    },

    /* ── Currency Formatter ── */
    formatPrice(price) {
        if (price === 0) return 'Gratis';
        return `$${price.toFixed(2)}`;
    },

    /* ── Platform Icons (SVG) ── */
    getPlatformIcon(platform) {
        const icons = {
            pc: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>`,
            ps5: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.886.696.38.583 1.378.583 1.378v10.142c-2.142 1.106-4.344 1.971-6.292 2.269V4.695c1.858-.474 3.45-.275 4.703.493.822.497 1.413 1.258 1.687 2.333.59 2.36.012 4.152-1.39 5.224v-.002c-.476.37-1.247.612-2 .771v-3.14c.29-.088.513-.209.696-.391.38-.366.478-.957.381-1.569-.087-.57-.475-1.126-1.077-1.326z"/></svg>`,
            xbox: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.102 21.033A11.947 11.947 0 0 0 12 24a11.947 11.947 0 0 0 7.898-2.967c-1.478-.248-4.162-1.576-7.898-6.076-3.736 4.5-6.42 5.828-7.898 6.076zM12 3.5c1.5 0 3 .5 4.5 1.5-1.5 1.5-3 3.5-4.5 6-1.5-2.5-3-4.5-4.5-6C9 4 10.5 3.5 12 3.5zM2.5 6C1 8 0 10.5 0 12c0 3 1 5.5 2.5 7.5 1-1 3-3 5.5-7C5.5 9 3.5 7 2.5 6zm19 0c-1 1-3 3-5.5 6.5 2.5 4 4.5 6 5.5 7C23 17.5 24 15 24 12c0-1.5-1-4-2.5-6z"/></svg>`
        };
        return icons[platform] || icons.pc;
    },

    /* ── Star Rating Renderer ── */
    renderStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        let html = '';
        for (let i = 0; i < full; i++) {
            html += `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        }
        if (half) {
            html += `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" opacity="1"/><path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.3"/></svg>`;
        }
        for (let i = 0; i < empty; i++) {
            html += `<svg viewBox="0 0 24 24" fill="currentColor" opacity="0.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        }
        return html;
    }
};

export default NexusApp;
