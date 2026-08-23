// User Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Populate Sidebar
    document.querySelector('.js-user-initial').textContent = user.name.charAt(0).toUpperCase();
    document.querySelector('.js-user-name').textContent = user.name;
    document.querySelector('.js-user-email').textContent = user.email;

    if (user.role === 'admin') {
        const btnAdmin = document.getElementById('btn-admin');
        btnAdmin.style.display = 'block';
        btnAdmin.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Tabs logic
    const btnOrders = document.getElementById('btn-orders');
    const btnAddresses = document.getElementById('btn-addresses');
    const viewOrders = document.querySelector('.js-view-orders');
    const viewAddresses = document.querySelector('.js-view-addresses');

    btnOrders.addEventListener('click', () => {
        btnOrders.classList.add('dashboard-nav__link--active');
        btnAddresses.classList.remove('dashboard-nav__link--active');
        viewOrders.style.display = 'block';
        viewAddresses.style.display = 'none';
    });

    btnAddresses.addEventListener('click', () => {
        btnAddresses.classList.add('dashboard-nav__link--active');
        btnOrders.classList.remove('dashboard-nav__link--active');
        viewAddresses.style.display = 'block';
        viewOrders.style.display = 'none';
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem(STORE_KEYS.USER);
        window.location.href = 'index.html';
    });

    // Render Orders
    renderOrders();
});

function renderOrders() {
    const container = document.getElementById('orders-list');
    const orders = JSON.parse(localStorage.getItem('marketplace_orders')) || [];

    if (orders.length === 0) {
        container.innerHTML = `<p style="color: var(--color-text-secondary);">No has realizado ningún pedido aún.</p>`;
        return;
    }

    const html = orders.reverse().map(order => {
        const date = new Date(order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const items = order.items.map(i => `${i.quantity}x ${i.title}`).join(', ');

        return `
            <div style="border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: var(--space-3); margin-bottom: var(--space-3);">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2); margin-bottom: var(--space-2);">
                    <div>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary);">PEDIDO REALIZADO</p>
                        <p style="font-weight: 500;">${date}</p>
                    </div>
                    <div>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary);">TOTAL</p>
                        <p style="font-weight: 500;">$${order.total.toFixed(2)}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary);">PEDIDO #</p>
                        <p style="font-weight: 500;">${order.id}</p>
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom: var(--space-1); font-size: 1rem;">Estado: <span style="color: var(--color-success);">${order.status}</span></h4>
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary);">${items}</p>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}
