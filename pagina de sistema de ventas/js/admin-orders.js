document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  
  const tableBody = document.getElementById('orders-table');
  const searchInput = document.getElementById('search-order');
  const filterStatus = document.getElementById('filter-status');
  const modal = document.getElementById('order-modal');
  const btnClose = document.getElementById('close-modal');
  const detailsContent = document.getElementById('order-details-content');
  const actionsContent = document.getElementById('order-actions');

  let orders = db.getAll('orders');

  const getStatusBadge = (status) => {
    const map = {
      'Pendiente': 'badge--pending',
      'En Proceso': 'badge--process',
      'Enviado': 'badge--shipped',
      'Entregado': 'badge--delivered',
      'Cancelado': 'badge--cancelled'
    };
    return `<span class="badge ${map[status] || ''}">${status}</span>`;
  };

  const renderTable = () => {
    let filtered = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const term = searchInput.value.toLowerCase();
    if (term) {
      filtered = filtered.filter(o => o.id.toLowerCase().includes(term));
    }

    const status = filterStatus.value;
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }

    tableBody.innerHTML = filtered.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${new Date(o.date).toLocaleDateString()}</td>
        <td>${o.customerId}</td>
        <td>$${o.total.toFixed(2)}</td>
        <td>${getStatusBadge(o.status)}</td>
        <td>
          <button class="btn btn--outline" style="padding: 4px 8px; font-size: 12px;" onclick="viewOrder('${o.id}')">Ver / Gestionar</button>
        </td>
      </tr>
    `).join('');
  };

  searchInput.addEventListener('input', renderTable);
  filterStatus.addEventListener('change', renderTable);

  const viewOrder = (id) => {
    const order = db.getById('orders', id);
    if (!order) return;

    detailsContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
        <div>
          <h4>Datos del Cliente</h4>
          <p class="u-text-muted">ID: ${order.customerId}</p>
        </div>
        <div>
          <h4>Dirección de Envío</h4>
          <p class="u-text-muted">${order.shippingAddress ? order.shippingAddress.street + ', ' + order.shippingAddress.city : 'N/A'}</p>
        </div>
      </div>
      <h4>Artículos</h4>
      <table class="order-items-table" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Variante</th>
            <th>Cant.</th>
            <th>Precio Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.variant || '-'}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="text-align: right;">
        <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
        <p>Impuestos: $${order.tax.toFixed(2)}</p>
        <h4>Total: $${order.total.toFixed(2)}</h4>
      </div>
    `;

    // Build Actions
    let actionButtons = `<button class="btn btn--outline" onclick="printReceipt('${order.id}')">Imprimir Recibo</button>`;
    
    if (order.status !== 'Cancelado' && order.status !== 'Entregado') {
      const nextStatusMap = {
        'Pendiente': 'En Proceso',
        'En Proceso': 'Enviado',
        'Enviado': 'Entregado'
      };
      
      const nextStatus = nextStatusMap[order.status];
      if (nextStatus) {
         actionButtons += `
          <div>
            <button class="btn btn--danger u-margin-right-2" onclick="changeStatus('${order.id}', 'Cancelado')">Cancelar</button>
            <button class="btn btn--primary" onclick="changeStatus('${order.id}', '${nextStatus}')">Marcar como ${nextStatus}</button>
          </div>
         `;
      }
    } else {
      actionButtons += `<div></div>`;
    }

    actionsContent.innerHTML = actionButtons;
    modal.classList.remove('u-hidden');
  };

  const closeModal = () => modal.classList.add('u-hidden');
  btnClose.addEventListener('click', closeModal);

  window.viewOrder = viewOrder;

  window.changeStatus = (id, newStatus) => {
    db.update('orders', id, { status: newStatus });
    orders = db.getAll('orders');
    renderTable();
    viewOrder(id); // refresh modal
  };

  window.printReceipt = (id) => {
    alert(`Generando PDF imprimible para la orden ${id}...`);
    // Simulando generación
  };

  renderTable();
});
