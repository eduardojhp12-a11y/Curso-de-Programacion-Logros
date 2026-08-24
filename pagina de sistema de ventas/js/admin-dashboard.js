document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  
  // Load Metrics
  const metrics = db.getMetrics();
  document.getElementById('metric-revenue').textContent = `$${metrics.totalRevenue.toFixed(2)}`;
  document.getElementById('metric-orders').textContent = metrics.ordersCount;
  document.getElementById('metric-ticket').textContent = `$${metrics.averageTicket.toFixed(2)}`;
  document.getElementById('metric-stock').textContent = metrics.lowStockCount;

  // Load Recent Orders
  const orders = db.getAll('orders').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const tableBody = document.getElementById('recent-orders-table');

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

  tableBody.innerHTML = orders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>${order.customerId}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td>${getStatusBadge(order.status)}</td>
    </tr>
  `).join('');
});
