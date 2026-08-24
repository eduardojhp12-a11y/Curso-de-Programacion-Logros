document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
      localStorage.setItem('ecommerce_erp_auth', 'true');
      window.location.href = 'admin-dashboard.html';
    } else {
      alert('Credenciales incorrectas. Usa admin / admin123');
    }
  });
});
