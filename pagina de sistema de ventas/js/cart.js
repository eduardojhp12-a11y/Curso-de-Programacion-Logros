document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const cartCount = document.getElementById('cart-count');
  const emptyContainer = document.getElementById('cart-empty');
  const contentContainer = document.getElementById('cart-content');
  const itemsContainer = document.getElementById('cart-items-container');
  
  const subtotalEl = document.getElementById('summary-subtotal');
  const taxEl = document.getElementById('summary-tax');
  const totalEl = document.getElementById('summary-total');

  const renderCart = () => {
    const cart = db.getCart();
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.length === 0) {
      emptyContainer.classList.remove('u-hidden');
      contentContainer.classList.add('u-hidden');
      return;
    }

    emptyContainer.classList.add('u-hidden');
    contentContainer.classList.remove('u-hidden');

    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__image">Img</div>
        <div class="cart-item__info">
          <h4>${item.name}</h4>
          <p class="u-text-sm u-text-muted">Variante: ${item.variant || 'N/A'}</p>
        </div>
        <div class="cart-item__qty">
          <input type="number" class="form-control" value="${item.quantity}" min="1" data-id="${item.cartId}" onchange="updateQty(this)">
        </div>
        <div class="cart-item__price">
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
          <button class="btn btn--danger btn--block u-margin-top-2" style="padding: 4px 8px; font-size: 12px;" onclick="removeItem('${item.cartId}')">Eliminar</button>
        </div>
      </div>
    `).join('');

    updateTotals(cart);
  };

  const updateTotals = (cart) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  };

  window.updateQty = (input) => {
    const cartId = input.getAttribute('data-id');
    const newQty = parseInt(input.value);
    if (newQty < 1) return;

    let cart = db.getCart();
    const item = cart.find(i => i.cartId === cartId);
    if (item) {
      item.quantity = newQty;
      db.setAll('cart', cart);
      renderCart();
    }
  };

  window.removeItem = (cartId) => {
    db.removeFromCart(cartId);
    renderCart();
  };

  document.getElementById('clear-cart').addEventListener('click', () => {
    if(confirm('¿Estás seguro de vaciar el carrito?')) {
      db.clearCart();
      renderCart();
    }
  });

  renderCart();
});
