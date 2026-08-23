// Checkout Logic

document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('checkout-summary');
    const form = document.getElementById('checkout-form');
    
    if (!summaryContainer || !form) return;

    // Must be logged in to checkout
    const user = getUser();
    if (!user) {
        alert('Debes iniciar sesión para proceder al pago.');
        window.location.href = 'login.html';
        return;
    }

    const cart = getCart();
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Render Summary
    let subtotal = 0;
    const itemsHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain; border: 1px solid var(--color-border); border-radius: 4px; padding: 2px; background: white;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 500; font-size: 0.875rem;">${item.title}</span>
                        <span style="color: var(--color-text-secondary); font-size: 0.75rem;">Cant: ${item.quantity}</span>
                    </div>
                </div>
                <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join('');

    summaryContainer.innerHTML = `
        <div style="margin-bottom: var(--space-3); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border);">
            ${itemsHTML}
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.25rem;">
            <span>Total:</span>
            <span style="color: var(--color-alert);">$${subtotal.toFixed(2)}</span>
        </div>
    `;

    // Handle Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulating API Call
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Procesando...';
        btn.disabled = true;
        
        setTimeout(() => {
            // Save order history (simulated)
            const orders = JSON.parse(localStorage.getItem('marketplace_orders')) || [];
            orders.push({
                id: 'ORD-' + Math.floor(Math.random() * 1000000),
                date: new Date().toISOString(),
                total: subtotal,
                items: cart,
                status: 'Confirmado'
            });
            localStorage.setItem('marketplace_orders', JSON.stringify(orders));

            // Clear Cart
            localStorage.removeItem(STORE_KEYS.CART);
            
            alert('¡Pago exitoso! Gracias por tu compra.');
            window.location.href = 'dashboard.html';
        }, 1500);
    });
});
