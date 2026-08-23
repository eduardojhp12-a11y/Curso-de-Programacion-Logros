// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    
    // Auth Guard
    if (!user || user.role !== 'admin') {
        alert('Acceso denegado. Se requieren permisos de administrador.');
        window.location.href = 'index.html';
        return;
    }

    renderKPIs();
    renderTable();
    initModal();
});

function renderKPIs() {
    const orders = JSON.parse(localStorage.getItem('marketplace_orders')) || [];
    const products = getProducts();

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    document.querySelector('.js-kpi-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.querySelector('.js-kpi-orders').textContent = orders.length;
    document.querySelector('.js-kpi-products').textContent = products.length;
}

function renderTable() {
    const tbody = document.getElementById('admin-table-body');
    const products = getProducts();

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td><img src="${p.image}" alt="Img" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px; border: 1px solid var(--color-border);"></td>
            <td>${p.title}</td>
            <td><span style="background-color: var(--color-bg-main); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${p.category}</span></td>
            <td>$${p.price.toFixed(2)}</td>
            <td>
                <button class="c-table-action js-edit-product" data-id="${p.id}">Editar</button>
                <button class="c-table-action c-table-action--danger js-delete-product" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');

    // Attach actions
    document.querySelectorAll('.js-delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm('¿Seguro que deseas eliminar este producto?')) {
                deleteProduct(parseInt(e.target.dataset.id));
            }
        });
    });

    document.querySelectorAll('.js-edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            openEditModal(parseInt(e.target.dataset.id));
        });
    });
}

function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    renderTable();
    renderKPIs();
}

// Modal Logic
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');

function initModal() {
    document.querySelector('.js-open-add-modal').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Añadir Producto';
        form.reset();
        document.getElementById('p-id').value = '';
        modal.classList.add('c-modal--active');
    });

    document.querySelector('.js-close-modal').addEventListener('click', () => {
        modal.classList.remove('c-modal--active');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
}

function openEditModal(id) {
    const products = getProducts();
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-title').value = p.title;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-brand').value = p.brand;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-image').value = p.image;

    modal.classList.add('c-modal--active');
}

function saveProduct() {
    let products = getProducts();
    
    const idVal = document.getElementById('p-id').value;
    const title = document.getElementById('p-title').value;
    const category = document.getElementById('p-category').value;
    const brand = document.getElementById('p-brand').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const image = document.getElementById('p-image').value;

    if (idVal) {
        // Update
        const idx = products.findIndex(p => p.id === parseInt(idVal));
        if (idx !== -1) {
            products[idx] = { id: parseInt(idVal), title, category, brand, price, image };
        }
    } else {
        // Create
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, title, category, brand, price, image });
    }

    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    
    modal.classList.remove('c-modal--active');
    renderTable();
    renderKPIs();
}
