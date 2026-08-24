document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const cart = db.getCart();

  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  const itemsContainer = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('chk-subtotal');
  const taxEl = document.getElementById('chk-tax');
  const totalEl = document.getElementById('chk-total');

  itemsContainer.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${item.quantity}x ${item.name} <small>(${item.variant || 'N/A'})</small></span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const orderData = {
      customerId: 'cust-guest', // Simplification for demo
      date: new Date().toISOString(),
      status: 'Pendiente',
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant
      })),
      subtotal,
      tax,
      shipping: 0,
      total,
      paymentMethod: document.querySelector('input[name="payment"]:checked').value,
      shippingAddress: {
        street: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zip').value,
        country: 'España'
      }
    };

    const newOrder = db.insert('orders', orderData);
    
    // Deduct stock
    cart.forEach(item => {
      const prod = db.getById('products', item.productId);
      if(prod) {
        db.update('products', item.productId, { stock: Math.max(0, prod.stock - item.quantity) });
      }
    });

    db.clearCart();
    
    alert(`Pedido confirmado exitosamente. Tu número de orden es: ${newOrder.id}`);
    window.location.href = `order-tracking.html?id=${newOrder.id}`;
  });
});
