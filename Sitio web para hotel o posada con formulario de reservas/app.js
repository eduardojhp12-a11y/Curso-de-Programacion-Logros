document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Lógica Global (Navbar, Footer)
    // ==========================================================================
    
    // Año dinámico en el footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Toggle del Navbar en Mobile
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
            navbarToggle.setAttribute('aria-expanded', !isExpanded);
            navbarMenu.classList.toggle('navbar__nav--open');
        });
    }

    // ==========================================================================
    // Lógica del Formulario de Reservas (reservas.html)
    // ==========================================================================
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        // 1. Establecer fecha mínima para Check-in (hoy)
        const getTodayString = () => {
            const today = new Date();
            // Ajuste para la zona horaria local
            const offset = today.getTimezoneOffset() * 60000;
            return new Date(today - offset).toISOString().split('T')[0];
        };
        
        const todayStr = getTodayString();
        checkinInput.setAttribute('min', todayStr);
        
        // 2. Lógica interactiva para Checkout (debe ser posterior al Check-in)
        checkinInput.addEventListener('change', () => {
            if (checkinInput.value) {
                // Al elegir checkin, el checkout mínimo es el día siguiente
                const checkinDate = new Date(checkinInput.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                const minCheckout = checkinDate.toISOString().split('T')[0];
                
                checkoutInput.setAttribute('min', minCheckout);
                
                // Si el checkout actual es inválido, limpiarlo
                if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
                    checkoutInput.value = '';
                    showError('checkout', 'La fecha de salida fue ajustada.');
                } else {
                    clearError('checkout');
                }
            }
        });

        // 3. Validación al enviar el formulario
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Limpiar todos los errores previos
            document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('input-error'));
            
            let isValid = true;
            
            // --- Validaciones individuales ---
            
            // Checkin y Checkout
            if (!checkinInput.value) {
                showError('checkin', 'Por favor, seleccione una fecha de entrada.');
                isValid = false;
            } else if (checkinInput.value < todayStr) {
                showError('checkin', 'La fecha de entrada no puede estar en el pasado.');
                isValid = false;
            }
            
            if (!checkoutInput.value) {
                showError('checkout', 'Por favor, seleccione una fecha de salida.');
                isValid = false;
            } else if (checkinInput.value && checkoutInput.value <= checkinInput.value) {
                showError('checkout', 'La fecha de salida debe ser posterior a la de entrada.');
                isValid = false;
            }
            
            // Tipo de Habitación
            const roomType = document.getElementById('roomType');
            if (!roomType.value) {
                showError('roomType', 'Por favor, seleccione un tipo de habitación.');
                isValid = false;
            }
            
            // Nombre Completo
            const fullName = document.getElementById('fullName');
            if (!fullName.value.trim() || fullName.value.trim().length < 3) {
                showError('fullName', 'Ingrese un nombre válido (mínimo 3 caracteres).');
                isValid = false;
            }
            
            // Correo Electrónico
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError('email', 'Ingrese un correo electrónico válido.');
                isValid = false;
            }
            
            // Teléfono
            const phone = document.getElementById('phone');
            // Regex básica para teléfono (acepta números, espacios, +, -)
            const phoneRegex = /^[\d\s\+\-]{8,20}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
                showError('phone', 'Ingrese un número de teléfono válido.');
                isValid = false;
            }
            
            // 4. Si todo es válido, procesar y guardar en localStorage
            if (isValid) {
                const bookingData = {
                    id: 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    checkin: checkinInput.value,
                    checkout: checkoutInput.value,
                    roomType: roomType.value,
                    adults: document.getElementById('adults').value,
                    children: document.getElementById('children').value,
                    fullName: fullName.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    bookingDate: new Date().toISOString()
                };
                
                try {
                    // Obtener reservas previas o crear array vacío
                    const bookings = JSON.parse(localStorage.getItem('posadaBookings') || '[]');
                    bookings.push(bookingData);
                    // Guardar en localStorage
                    localStorage.setItem('posadaBookings', JSON.stringify(bookings));
                    
                    // Mostrar mensaje de éxito
                    const successMsg = document.getElementById('booking-success');
                    successMsg.removeAttribute('hidden');
                    
                    // Deshabilitar el botón para evitar doble envío
                    const submitBtn = bookingForm.querySelector('.booking-form__submit');
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.textContent = 'Procesado';
                    
                    // Hacer scroll suave hacia el mensaje de éxito
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Opcional: Imprimir en consola para verificación en desarrollo
                    console.log('Reserva guardada con éxito:', bookingData);
                    
                } catch (error) {
                    console.error('Error al guardar en localStorage:', error);
                    alert('Hubo un problema procesando su reserva. Por favor intente más tarde.');
                }
            }
        });
        
        // Funciones auxiliares para mostrar/limpiar errores
        function showError(fieldId, message) {
            const errorElement = document.getElementById(`error-${fieldId}`);
            const inputElement = document.getElementById(fieldId);
            if (errorElement && inputElement) {
                errorElement.textContent = message;
                inputElement.classList.add('input-error');
            }
        }

        function clearError(fieldId) {
            const errorElement = document.getElementById(`error-${fieldId}`);
            const inputElement = document.getElementById(fieldId);
            if (errorElement && inputElement) {
                errorElement.textContent = '';
                inputElement.classList.remove('input-error');
            }
        }
        
        // Limpiar errores en tiempo real al escribir/cambiar
        const formInputs = bookingForm.querySelectorAll('.form-input, .form-select');
        formInputs.forEach(input => {
            input.addEventListener('input', () => clearError(input.id));
            input.addEventListener('change', () => clearError(input.id));
        });
    }
});
