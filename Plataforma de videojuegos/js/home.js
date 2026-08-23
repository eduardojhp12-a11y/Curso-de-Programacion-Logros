/* ============================================================
   NEXUS STORE — Home Page Module
   Hero carousel, game card rendering, countdown timers
   ============================================================ */

import NexusApp from './app.js';
import GamesDB from './data.js';

const HomePage = {
    carouselIndex: 0,
    carouselTimer: null,
    carouselDuration: 6000,
    progressStart: null,
    progressRAF: null,

    init() {
        NexusApp.init();
        this.renderHero();
        this.renderBestsellers();
        this.renderOffers();
        this.renderCategories();
        this.renderTrending();
        this.startCarousel();
        this.startCountdowns();
        this.initScrollAnimations();
    },

    /* ============================================================
       HERO CAROUSEL
       ============================================================ */
    renderHero() {
        const slidesContainer = document.getElementById('hero-slides');
        const controlsContainer = document.getElementById('hero-controls');

        if (!slidesContainer || !controlsContainer) return;

        const games = GamesDB.featured;

        slidesContainer.innerHTML = games.map((game, i) => `
            <div class="hero__slide ${i === 0 ? 'hero__slide--active' : ''}" data-index="${i}">
                <img class="hero__slide-image" src="${game.heroImage}" alt="${game.title}" loading="${i === 0 ? 'eager' : 'lazy'}">
                <div class="hero__slide-overlay"></div>
                <div class="hero__slide-content">
                    <span class="hero__slide-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ${game.tags[0] || 'Destacado'}
                    </span>
                    <h2 class="hero__slide-title">${game.title}</h2>
                    <p class="hero__slide-desc">${game.description}</p>
                    <div class="hero__slide-actions">
                        <button class="btn btn--primary btn--lg" data-game-id="${game.id}" id="hero-buy-${game.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Comprar Ahora
                        </button>
                        <div class="hero__slide-price">
                            <span class="hero__slide-price-current">${NexusApp.formatPrice(game.price)}</span>
                            ${game.originalPrice ? `<span class="hero__slide-price-original">${NexusApp.formatPrice(game.originalPrice)}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        /* Dots & arrows */
        let dotsHTML = `
            <button class="hero__arrow" id="hero-prev" aria-label="Anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        `;
        games.forEach((_, i) => {
            dotsHTML += `<button class="hero__dot ${i === 0 ? 'hero__dot--active' : ''}" data-index="${i}" aria-label="Ir a diapositiva ${i + 1}"></button>`;
        });
        dotsHTML += `
            <button class="hero__arrow" id="hero-next" aria-label="Siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        `;
        controlsContainer.innerHTML = dotsHTML;

        /* Event Listeners */
        document.getElementById('hero-prev').addEventListener('click', () => this.prevSlide());
        document.getElementById('hero-next').addEventListener('click', () => this.nextSlide());

        controlsContainer.querySelectorAll('.hero__dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.index));
            });
        });

        /* Buy buttons in hero */
        slidesContainer.querySelectorAll('[data-game-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const game = GamesDB.featured.find(g => g.id === btn.dataset.gameId);
                if (game) NexusApp.addToCart(game);
            });
        });
    },

    goToSlide(index) {
        const slides = document.querySelectorAll('.hero__slide');
        const dots = document.querySelectorAll('.hero__dot');

        if (!slides.length) return;

        this.carouselIndex = index;
        const offset = -index * 100;
        document.getElementById('hero-slides').style.transform = `translateX(${offset}%)`;

        slides.forEach((s, i) => s.classList.toggle('hero__slide--active', i === index));
        dots.forEach((d, i) => d.classList.toggle('hero__dot--active', i === index));

        this.resetProgress();
    },

    nextSlide() {
        const total = GamesDB.featured.length;
        this.goToSlide((this.carouselIndex + 1) % total);
    },

    prevSlide() {
        const total = GamesDB.featured.length;
        this.goToSlide((this.carouselIndex - 1 + total) % total);
    },

    startCarousel() {
        this.resetProgress();
        this.carouselTimer = setInterval(() => this.nextSlide(), this.carouselDuration);
    },

    resetProgress() {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
        }
        this.carouselTimer = setInterval(() => this.nextSlide(), this.carouselDuration);

        const bar = document.getElementById('hero-progress-bar');
        if (!bar) return;

        if (this.progressRAF) cancelAnimationFrame(this.progressRAF);
        this.progressStart = performance.now();

        const animate = (now) => {
            const elapsed = now - this.progressStart;
            const pct = Math.min((elapsed / this.carouselDuration) * 100, 100);
            bar.style.width = `${pct}%`;
            if (pct < 100) {
                this.progressRAF = requestAnimationFrame(animate);
            }
        };
        this.progressRAF = requestAnimationFrame(animate);
    },

    /* ============================================================
       GAME CARD RENDERER (reusable)
       ============================================================ */
    renderGameCard(game) {
        const hasImage = game.coverImage && game.coverImage !== null;
        const imageContent = hasImage
            ? `<img class="game-card__image" src="${game.coverImage}" alt="${game.title}" loading="lazy">`
            : `<div class="game-card__image-placeholder" style="background: ${game.gradient || 'var(--color-bg-secondary)'}">
                    <span>${game.icon || game.title.charAt(0)}</span>
               </div>`;

        const badgesHTML = (game.tags || []).map(tag => {
            let cls = 'badge--platform';
            if (tag === 'New Release' || tag === 'Nuevo') cls = 'badge--new';
            if (tag === 'Hot') cls = 'badge--hot';
            if (tag === 'Free to Play') cls = 'badge--new';
            if (tag === 'Bestseller') cls = 'badge--discount';
            return `<span class="badge ${cls}">${tag}</span>`;
        }).join('');

        const discountBadge = game.discount > 0 ? `<span class="badge badge--discount">-${game.discount}%</span>` : '';

        const platformsHTML = (game.platforms || []).map(p =>
            `<span class="game-card__platform" title="${p.toUpperCase()}">${NexusApp.getPlatformIcon(p)}</span>`
        ).join('');

        const priceHTML = game.price === 0
            ? `<span class="game-card__price--free">Gratis</span>`
            : `<div class="game-card__price">
                    <span class="game-card__price-current">${NexusApp.formatPrice(game.price)}</span>
                    ${game.originalPrice ? `<span class="game-card__price-original">${NexusApp.formatPrice(game.originalPrice)}</span>` : ''}
               </div>`;

        const isInWishlist = NexusApp.isInWishlist(game.id);

        return `
            <article class="game-card" data-game-id="${game.id}" id="game-card-${game.id}">
                <div class="game-card__image-wrapper">
                    ${imageContent}
                    <div class="game-card__badges">
                        ${discountBadge}
                        ${badgesHTML}
                    </div>
                    <div class="game-card__overlay">
                        <div class="game-card__quick-actions">
                            <button class="game-card__quick-btn game-card__quick-btn--cart" data-action="add-cart" data-game-id="${game.id}" aria-label="Añadir al carrito">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                Carrito
                            </button>
                            <button class="game-card__quick-btn game-card__quick-btn--wishlist ${isInWishlist ? 'game-card__quick-btn--wishlisted' : ''}" data-action="toggle-wishlist" data-game-id="${game.id}" aria-label="${isInWishlist ? 'Quitar de deseados' : 'Añadir a deseados'}">
                                <svg viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="game-card__body">
                    <div class="game-card__platforms">${platformsHTML}</div>
                    <h3 class="game-card__title">${game.title}</h3>
                    <p class="game-card__genre">${game.genre}</p>
                    <div class="game-card__footer">
                        ${priceHTML}
                        <div class="game-card__rating">
                            ${NexusApp.renderStars(game.rating)}
                            <span>${game.rating}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    },

    /* ============================================================
       BESTSELLERS
       ============================================================ */
    renderBestsellers() {
        const grid = document.getElementById('bestsellers-grid');
        if (!grid) return;

        const allGames = [...GamesDB.featured, ...GamesDB.bestsellers].slice(0, 5);
        grid.innerHTML = allGames.map(game => this.renderGameCard(game)).join('');
        this.attachCardListeners(grid);
    },

    /* ============================================================
       SPECIAL OFFERS
       ============================================================ */
    renderOffers() {
        const grid = document.getElementById('offers-grid');
        if (!grid) return;

        grid.innerHTML = GamesDB.offers.map(offer => {
            const hasImage = offer.coverImage && offer.coverImage !== null;
            const imageContent = hasImage
                ? `<img class="offer-card__image" src="${offer.coverImage}" alt="${offer.title}" loading="lazy">`
                : `<div class="offer-card__image-placeholder" style="background: ${offer.gradient || 'var(--color-bg-secondary)'}">
                        <span>${offer.icon || offer.title.charAt(0)}</span>
                   </div>`;

            return `
                <div class="offer-card" id="offer-${offer.id}">
                    <div class="offer-card__image-wrapper">
                        ${imageContent}
                    </div>
                    <div class="offer-card__content">
                        <div class="offer-card__timer">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round"/></svg>
                            La oferta termina en:
                        </div>
                        <div class="offer-card__countdown" data-countdown="${offer.endsIn}" id="countdown-${offer.id}">
                            <div class="offer-card__countdown-unit">
                                <span class="offer-card__countdown-value" data-unit="d">00</span>
                                <span class="offer-card__countdown-label">Días</span>
                            </div>
                            <div class="offer-card__countdown-unit">
                                <span class="offer-card__countdown-value" data-unit="h">00</span>
                                <span class="offer-card__countdown-label">Hrs</span>
                            </div>
                            <div class="offer-card__countdown-unit">
                                <span class="offer-card__countdown-value" data-unit="m">00</span>
                                <span class="offer-card__countdown-label">Min</span>
                            </div>
                            <div class="offer-card__countdown-unit">
                                <span class="offer-card__countdown-value" data-unit="s">00</span>
                                <span class="offer-card__countdown-label">Seg</span>
                            </div>
                        </div>
                        <h3 class="offer-card__title">${offer.title}</h3>
                        <p class="offer-card__genre">${offer.genre}</p>
                        <div class="offer-card__pricing">
                            <span class="offer-card__discount">-${offer.discount}%</span>
                            ${offer.originalPrice ? `<span class="offer-card__price-original">${NexusApp.formatPrice(offer.originalPrice)}</span>` : ''}
                            <span class="offer-card__price-current">${NexusApp.formatPrice(offer.price)}</span>
                        </div>
                        <button class="btn btn--cyan offer-card__cta" data-action="add-cart" data-game-id="${offer.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        /* Attach offer card buy listeners */
        grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.dataset.gameId;
                const game = [...GamesDB.offers, ...GamesDB.featured, ...GamesDB.bestsellers, ...GamesDB.trending].find(g => g.id === gameId);
                if (game) NexusApp.addToCart(game);
            });
        });
    },

    /* ============================================================
       CATEGORIES
       ============================================================ */
    renderCategories() {
        const grid = document.getElementById('categories-grid');
        if (!grid) return;

        grid.innerHTML = GamesDB.categories.map(cat => `
            <a href="catalog.html?genre=${cat.id}" class="category-card category-card--${cat.cssClass}" id="category-${cat.id}">
                <div class="category-card__icon">${cat.icon}</div>
                <span class="category-card__name">${cat.name}</span>
                <span class="category-card__count">${cat.count} juegos</span>
            </a>
        `).join('');
    },

    /* ============================================================
       TRENDING / NEW RELEASES
       ============================================================ */
    renderTrending() {
        const grid = document.getElementById('trending-grid');
        if (!grid) return;

        grid.innerHTML = GamesDB.trending.map(game => this.renderGameCard(game)).join('');
        this.attachCardListeners(grid);
    },

    /* ============================================================
       CARD EVENT LISTENERS
       ============================================================ */
    attachCardListeners(container) {
        container.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.dataset.gameId;
                const game = this.findGameById(gameId);
                if (game) NexusApp.addToCart(game);
            });
        });

        container.querySelectorAll('[data-action="toggle-wishlist"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.dataset.gameId;
                const game = this.findGameById(gameId);
                if (game) {
                    const added = NexusApp.toggleWishlist(game);
                    const heartSvg = btn.querySelector('svg');
                    if (heartSvg) {
                        heartSvg.setAttribute('fill', added ? 'currentColor' : 'none');
                    }
                }
            });
        });

        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-action]')) return;
                const gameId = card.dataset.gameId;
                window.location.href = `product.html?id=${gameId}`;
            });
        });
    },

    /* ============================================================
       COUNTDOWN TIMER
       ============================================================ */
    startCountdowns() {
        const countdowns = document.querySelectorAll('[data-countdown]');

        const tick = () => {
            countdowns.forEach(el => {
                let remaining = parseInt(el.dataset.countdown);
                if (remaining <= 0) return;

                remaining--;
                el.dataset.countdown = remaining;

                const days = Math.floor(remaining / 86400);
                const hours = Math.floor((remaining % 86400) / 3600);
                const minutes = Math.floor((remaining % 3600) / 60);
                const seconds = remaining % 60;

                const d = el.querySelector('[data-unit="d"]');
                const h = el.querySelector('[data-unit="h"]');
                const m = el.querySelector('[data-unit="m"]');
                const s = el.querySelector('[data-unit="s"]');

                if (d) d.textContent = String(days).padStart(2, '0');
                if (h) h.textContent = String(hours).padStart(2, '0');
                if (m) m.textContent = String(minutes).padStart(2, '0');
                if (s) s.textContent = String(seconds).padStart(2, '0');
            });
        };

        tick();
        setInterval(tick, 1000);
    },

    /* ============================================================
       SCROLL ANIMATIONS (Intersection Observer)
       ============================================================ */
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 600ms ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.game-card, .offer-card, .category-card, .promo-banner').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    },

    /* ============================================================
       UTILITY — Find game across all collections
       ============================================================ */
    findGameById(id) {
        return [...GamesDB.featured, ...GamesDB.bestsellers, ...GamesDB.offers, ...GamesDB.trending].find(g => g.id === id) || null;
    }
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => HomePage.init());
