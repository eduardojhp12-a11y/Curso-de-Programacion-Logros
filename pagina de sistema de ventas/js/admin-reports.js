document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  
  const orders = db.getAll('orders').filter(o => o.status !== 'Cancelado');
  const products = db.getAll('products');

  // Calculate Balance
  let totalRevenue = 0;
  let totalCost = 0;
  
  // Products Sales Map
  const salesMap = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      totalRevenue += (item.price * item.quantity);
      
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        totalCost += (p.cost * item.quantity);
      }

      if (!salesMap[item.productId]) {
        salesMap[item.productId] = { name: item.name, qty: 0, rev: 0 };
      }
      salesMap[item.productId].qty += item.quantity;
      salesMap[item.productId].rev += (item.price * item.quantity);
    });
  });

  const margin = totalRevenue - totalCost;

  document.getElementById('rep-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  document.getElementById('rep-cost').textContent = `$${totalCost.toFixed(2)}`;
  document.getElementById('rep-margin').textContent = `$${margin.toFixed(2)}`;

  // Top Products
  const topList = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  
  document.getElementById('top-products-table').innerHTML = topList.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>$${item.rev.toFixed(2)}</td>
    </tr>
  `).join('');

  // Export DB
  document.getElementById('export-db').addEventListener('click', () => {
    const data = {
      products: db.getAll('products'),
      categories: db.getAll('categories'),
      customers: db.getAll('customers'),
      orders: db.getAll('orders')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `technova_erp_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
});
