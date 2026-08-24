document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const cartCount = document.getElementById('cart-count');
  const cart = db.getCart();
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

  const catalogGrid = document.getElementById('catalog-grid');
  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('search-input');
  const sortFilter = document.getElementById('sort-filter');
  const stockFilter = document.getElementById('stock-filter');

  const products = db.getAll('products');
  const categories = db.getAll('categories');

  // Populate categories
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categoryFilter.appendChild(option);
  });

  // Read URL params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    categoryFilter.value = categoryParam;
  }

  const renderProducts = () => {
    let filtered = [...products];
    
    const term = searchInput.value.toLowerCase();
    if (term) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }

    const cat = categoryFilter.value;
    if (cat) {
      filtered = filtered.filter(p => p.categoryId === cat);
    }

    const stock = stockFilter.value;
    if (stock === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 0);
    } else if (stock === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    const sort = sortFilter.value;
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `<p class="u-text-muted">No se encontraron productos que coincidan con los filtros.</p>`;
      return;
    }

    catalogGrid.innerHTML = filtered.map(prod => `
      <div class="card product-card">
        <div class="product-card__image-wrapper">
          <span class="product-card__image-placeholder">Imagen: ${prod.name}</span>
        </div>
        <div class="card__body u-flex-column" style="flex: 1;">
          <h4>${prod.name}</h4>
          <p class="product-card__price">$${prod.price.toFixed(2)}</p>
          <p class="u-text-sm u-margin-bottom-3 ${prod.stock > 0 ? 'u-text-success' : 'u-text-danger'}">
            ${prod.stock > 0 ? `En Stock (${prod.stock})` : 'Agotado'}
          </p>
          <a href="product-detail.html?id=${prod.id}" class="btn btn--primary btn--block mt-auto">Ver Detalles</a>
        </div>
      </div>
    `).join('');
  };

  searchInput.addEventListener('input', renderProducts);
  categoryFilter.addEventListener('change', renderProducts);
  sortFilter.addEventListener('change', renderProducts);
  stockFilter.addEventListener('change', renderProducts);

  renderProducts();
});
