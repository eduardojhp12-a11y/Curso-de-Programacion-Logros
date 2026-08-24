/**
 * app.js
 * Lógica global, sincronización de pestañas y utilidades compartidas.
 * Se puede incluir en todas las páginas públicas si es necesario,
 * pero ya tenemos la inicialización en db.js y enrutamiento nativo por HTML.
 * Aquí agregaremos listener global de localStorage para actualizar UI entre pestañas.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Listen for external changes in localStorage (e.g., cart updated in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'ecommerce_erp_cart') {
      const cartCountEl = document.getElementById('cart-count');
      if (cartCountEl) {
        const cart = JSON.parse(e.newValue || '[]');
        cartCountEl.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
      }
    }
  });
  
  // Custom global router function just as a utility, though HTML native links are used.
  window.navigateTo = (path) => {
    window.location.href = path;
  };
});
