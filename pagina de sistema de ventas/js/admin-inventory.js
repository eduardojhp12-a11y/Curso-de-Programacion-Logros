document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  
  const tableBody = document.getElementById('inventory-table');
  const searchInput = document.getElementById('search-inventory');
  const filterStock = document.getElementById('filter-stock');

  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const btnNew = document.getElementById('btn-new-product');
  const btnClose = document.getElementById('close-modal');

  let products = db.getAll('products');

  const renderTable = () => {
    let filtered = [...products];
    const term = searchInput.value.toLowerCase();
    
    if (term) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
    }

    const stock = filterStock.value;
    if (stock === 'low') {
      filtered = filtered.filter(p => p.stock < 15 && p.stock > 0);
    } else if (stock === 'out') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    tableBody.innerHTML = filtered.map(p => {
      let stockClass = 'stock-indicator--good';
      if (p.stock === 0) stockClass = 'stock-indicator--out';
      else if (p.stock < 15) stockClass = 'stock-indicator--low';

      return `
        <tr>
          <td><small class="u-text-muted">${p.id}</small></td>
          <td>${p.name}</td>
          <td>${p.categoryId}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>$${p.cost.toFixed(2)}</td>
          <td><span class="stock-indicator ${stockClass}"></span> ${p.stock}</td>
          <td>
            <button class="btn btn--outline" style="padding: 4px 8px; font-size: 12px;" onclick="editProduct('${p.id}')">Editar</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  searchInput.addEventListener('input', renderTable);
  filterStock.addEventListener('change', renderTable);

  // Modal Logic
  const openModal = (id = null) => {
    form.reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('modal-title').textContent = 'Nuevo Producto';

    if (id) {
      const p = db.getById('products', id);
      if (p) {
        document.getElementById('modal-title').textContent = 'Editar Producto';
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-desc').value = p.description;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-cost').value = p.cost;
        document.getElementById('prod-stock').value = p.stock;
        document.getElementById('prod-category').value = p.categoryId;
      }
    }
    modal.classList.remove('u-hidden');
  };

  const closeModal = () => modal.classList.add('u-hidden');

  btnNew.addEventListener('click', () => openModal());
  btnClose.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const prodData = {
      name: document.getElementById('prod-name').value,
      description: document.getElementById('prod-desc').value,
      price: parseFloat(document.getElementById('prod-price').value),
      cost: parseFloat(document.getElementById('prod-cost').value),
      stock: parseInt(document.getElementById('prod-stock').value),
      categoryId: document.getElementById('prod-category').value,
      images: [],
      variants: [],
      status: parseInt(document.getElementById('prod-stock').value) > 0 ? 'active' : 'out-of-stock'
    };

    if (id) {
      db.update('products', id, prodData);
    } else {
      db.insert('products', prodData);
    }

    products = db.getAll('products');
    renderTable();
    closeModal();
  });

  window.editProduct = openModal;

  renderTable();
});
