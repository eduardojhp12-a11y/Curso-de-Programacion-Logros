document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       MENÚ DIGITAL - FILTRADO POR CATEGORÍAS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.button--filter');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('button--active'));
            // Añadir clase activa al botón clickeado
            button.classList.add('button--active');

            const filterValue = button.getAttribute('data-filter');

            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // Mostrar todos o mostrar por categoría
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hidden');
                    // Hack para reiniciar la animación CSS (FadeIn)
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = null;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ==========================================================================
       VALIDACIÓN DEL FORMULARIO DE RESERVAS
       ========================================================================== */
    const reservationForm = document.getElementById('reservation-form');
    const successMsg = document.getElementById('form-success-msg');

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Limpiar mensajes previos de error
            successMsg.textContent = '';
            document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
            document.querySelectorAll('.form__input').forEach(el => el.classList.remove('form__input--error'));

            // Validar Nombre
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim() === '') {
                showError('name', 'El nombre es obligatorio.');
                isValid = false;
            }

            // Validar Fecha (no permitir fechas en el pasado)
            const dateInput = document.getElementById('date');
            if (dateInput.value.trim() === '') {
                showError('date', 'Selecciona una fecha para la reserva.');
                isValid = false;
            } else {
                const selectedDate = new Date(dateInput.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Ignorar la hora actual
                
                // Ajustar zona horaria local para comparar correctamente
                const adjustedSelectedDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);

                if (adjustedSelectedDate < today) {
                    showError('date', 'La fecha de reserva no puede ser en el pasado.');
                    isValid = false;
                }
            }

            // Validar Hora
            const timeInput = document.getElementById('time');
            if (timeInput.value.trim() === '') {
                showError('time', 'Selecciona la hora de tu reserva.');
                isValid = false;
            }

            // Validar Número de Personas
            const guestsInput = document.getElementById('guests');
            if (guestsInput.value.trim() === '' || guestsInput.value < 1 || guestsInput.value > 20) {
                showError('guests', 'Ingresa un número válido de personas (1-20).');
                isValid = false;
            }

            // Si todo el formulario es válido
            if (isValid) {
                // Aquí se integraría con un backend (Fetch/AJAX).
                // Simulamos éxito para el frontend:
                successMsg.textContent = '¡Tu reserva ha sido confirmada con éxito! Te esperamos pronto.';
                reservationForm.reset();
            }
        });
    }

    // Función auxiliar para mostrar errores de formulario
    function showError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}-error`);
        
        if (inputElement && errorElement) {
            inputElement.classList.add('form__input--error');
            errorElement.textContent = message;
        }
    }
});
