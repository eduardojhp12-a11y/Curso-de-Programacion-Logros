document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const inputEl = document.getElementById('order-id-input');
  const btnEl = document.getElementById('track-btn');
  const resultContainer = document.getElementById('tracking-result');
  const titleEl = document.getElementById('order-title');
  const dateEl = document.getElementById('order-date');
  const totalEl = document.getElementById('order-total');
  const timelineEl = document.getElementById('timeline');

  const states = ['Pendiente', 'En Proceso', 'Enviado', 'Entregado'];

  const trackOrder = (id) => {
    const order = db.getById('orders', id);
    if (!order) {
      alert('No se encontró ninguna orden con ese ID');
      resultContainer.classList.add('u-hidden');
      return;
    }

    resultContainer.classList.remove('u-hidden');
    titleEl.textContent = `Estado del Pedido: ${order.status}`;
    dateEl.textContent = `Fecha de compra: ${new Date(order.date).toLocaleDateString()}`;
    totalEl.textContent = `Total: $${order.total.toFixed(2)}`;

    let currentStepIndex = states.indexOf(order.status);
    if(order.status === 'Cancelado') currentStepIndex = -1;

    timelineEl.innerHTML = states.map((state, index) => {
      let statusClass = '';
      if (order.status === 'Cancelado') {
         statusClass = 'cancelled';
      } else if (index < currentStepIndex) {
        statusClass = 'completed';
      } else if (index === currentStepIndex) {
        statusClass = 'active';
      }
      return `
        <div class="timeline-step ${statusClass}">
          <div class="timeline-step__icon"></div>
          <div class="timeline-step__label">${state}</div>
        </div>
      `;
    }).join('');
    
    if (order.status === 'Cancelado') {
        timelineEl.innerHTML = `
        <div class="timeline-step active" style="flex:1;">
          <div class="timeline-step__icon" style="border-color: var(--color-danger); background-color: var(--color-danger);"></div>
          <div class="timeline-step__label" style="color: var(--color-danger);">Cancelado</div>
        </div>
        `;
    }
  };

  btnEl.addEventListener('click', () => {
    const id = inputEl.value.trim();
    if (id) trackOrder(id);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const orderParam = urlParams.get('id');
  if (orderParam) {
    inputEl.value = orderParam;
    trackOrder(orderParam);
  }
});
