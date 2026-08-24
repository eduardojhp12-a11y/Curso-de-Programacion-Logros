document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  
  // Update cart count
  const cartCount = document.getElementById('cart-count');
  const cart = db.getCart();
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Load Categories
  const categoryContainer = document.getElementById('category-container');
  const categories = db.getAll('categories');
  
  if (categoryContainer && categories.length > 0) {
    categoryContainer.innerHTML = categories.map(cat => `
      <div class="category-card" onclick="window.location.href='catalog.html?category=${cat.id}'">
        <h3 class="category-card__title">${cat.name}</h3>
        <p class="u-text-muted">${cat.description}</p>
      </div>
    `).join('');
  }

  // Load Featured Products
  const featuredContainer = document.getElementById('featured-products-container');
  const products = db.getAll('products');
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  if (featuredContainer && featuredProducts.length > 0) {
    featuredContainer.innerHTML = featuredProducts.map(prod => `
      <div class="card product-card">
        <div class="product-card__image-wrapper">
          <span class="product-card__image-placeholder">Imagen: ${prod.name}</span>
        </div>
        <div class="card__body u-flex-column" style="flex: 1;">
          <h4>${prod.name}</h4>
          <p class="product-card__price">$${prod.price.toFixed(2)}</p>
          <a href="product-detail.html?id=${prod.id}" class="btn btn--primary btn--block mt-auto">Ver Detalles</a>
        </div>
      </div>
    `).join('');
  }
});
