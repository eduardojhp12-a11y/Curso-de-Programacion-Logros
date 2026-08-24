document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const cartCount = document.getElementById('cart-count');
  
  const updateCartCount = () => {
    const cart = db.getCart();
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  };
  updateCartCount();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const container = document.getElementById('product-container');

  if (!productId) {
    container.innerHTML = `<h2>Producto no encontrado</h2><a href="catalog.html" class="btn btn--primary">Volver al catálogo</a>`;
    return;
  }

  const product = db.getById('products', productId);
  if (!product) {
    container.innerHTML = `<h2>Producto no encontrado</h2><a href="catalog.html" class="btn btn--primary">Volver al catálogo</a>`;
    return;
  }

  const cat = db.getById('categories', product.categoryId);

  // Group variants by type
  const variantGroups = {};
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (!variantGroups[v.type]) variantGroups[v.type] = [];
      variantGroups[v.type].push(v.value);
    });
  }

  let selectedVariants = {};
  
  const renderProduct = () => {
    let variantsHtml = '';
    for (const [type, values] of Object.entries(variantGroups)) {
      if (!selectedVariants[type]) selectedVariants[type] = values[0]; // select first by default
      variantsHtml += `
        <div class="u-margin-bottom-3">
          <label class="form-label" style="text-transform: capitalize;">${type}</label>
          <div class="variant-selector">
            ${values.map(val => `
              <button class="variant-btn ${selectedVariants[type] === val ? 'selected' : ''}" data-type="${type}" data-value="${val}">
                ${val}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="product-gallery">
        <h3 class="u-text-muted">Imagen: ${product.name}</h3>
      </div>
      <div class="product-info">
        <p class="u-text-muted" style="text-transform: uppercase; font-size: var(--font-xs);">${cat ? cat.name : 'General'}</p>
        <h1>${product.name}</h1>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p class="u-margin-bottom-4">${product.description}</p>
        
        ${variantsHtml}
        
        <div class="u-margin-bottom-3">
          <label class="form-label">Disponibilidad</label>
          <p class="${product.stock > 0 ? 'u-text-success' : 'u-text-danger'} font-weight-bold">
            ${product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado temporalmente'}
          </p>
        </div>

        <div class="quantity-selector">
          <label class="form-label">Cantidad</label>
          <input type="number" id="qty-input" class="form-control quantity-input" value="1" min="1" max="${product.stock}">
        </div>

        <button id="add-to-cart" class="btn btn--primary btn--block" ${product.stock === 0 ? 'disabled' : ''}>
          ${product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
        </button>
      </div>
    `;

    // Attach variant click events
    document.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.getAttribute('data-type');
        const val = e.target.getAttribute('data-value');
        selectedVariants[type] = val;
        renderProduct(); // re-render
      });
    });

    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('qty-input').value) || 1;
        const variantString = Object.entries(selectedVariants).map(([k, v]) => `${v}`).join(', ');
        
        db.addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          variant: variantString
        });
        
        updateCartCount();
        alert('Producto añadido al carrito exitosamente');
      });
    }
  };

  renderProduct();
});
