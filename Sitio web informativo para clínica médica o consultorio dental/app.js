document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const modal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalDetails = document.getElementById('modal-details');

    // Función para validar campos individuales
    const validateField = (input, errorElement) => {
        const formGroup = input.closest('.form-group');
        let isValid = true;

        if (input.required && !input.value.trim()) {
            isValid = false;
        }

        // Validación adicional para fecha (que no sea anterior a hoy)
        if (input.type === 'date' && input.value) {
            const selectedDate = new Date(input.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Fix timezone issue by parsing date string directly
            const [year, month, day] = input.value.split('-');
            const dateObj = new Date(year, month - 1, day);

            if (dateObj < today) {
                isValid = false;
                errorElement.textContent = 'La fecha no puede ser en el pasado.';
            } else {
                 errorElement.textContent = 'Seleccione una fecha válida.';
            }
        }

        if (isValid) {
            formGroup.classList.remove('is-invalid');
        } else {
            formGroup.classList.add('is-invalid');
        }

        return isValid;
    };

    // Agregar validación en tiempo real (al salir del campo o cambiar)
    if (bookingForm) {
        const inputs = bookingForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            const errorId = `error-${input.id.split('-')[1]}`;
            const errorElement = document.getElementById(errorId);
            
            input.addEventListener('blur', () => {
                validateField(input, errorElement);
            });
            input.addEventListener('change', () => {
                validateField(input, errorElement);
            });
        });

        // Manejar el envío del formulario
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;

            const formData = {};

            inputs.forEach(input => {
                const errorId = `error-${input.id.split('-')[1]}`;
                const errorElement = document.getElementById(errorId);
                const isFieldValid = validateField(input, errorElement);
                
                if (!isFieldValid) {
                    formIsValid = false;
                } else {
                    const key = input.id.split('-')[1];
                    formData[key] = input.value;
                }
            });

            if (formIsValid) {
                // Guardar en localStorage
                saveBookingToLocalStorage(formData);
                
                // Mostrar detalles en el modal
                populateModalDetails(formData);

                // Mostrar el modal
                openModal();
                
                // Limpiar formulario
                bookingForm.reset();
                inputs.forEach(input => input.closest('.form-group').classList.remove('is-invalid'));
            }
        });
    }

    // Funciones del Modal
    const openModal = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        modalCloseBtn.focus();
        document.body.style.overflow = 'hidden'; // Prevenir scroll de fondo
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const populateModalDetails = (data) => {
        const specialtyLabel = document.querySelector(`#booking-specialty option[value="${data.specialty}"]`).textContent;
        
        // Formatear la fecha para mostrar (DD/MM/YYYY)
        const [year, month, day] = data.date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        modalDetails.innerHTML = `
            <p><strong>Paciente:</strong> ${data.name}</p>
            <p><strong>Teléfono:</strong> ${data.phone}</p>
            <p><strong>Especialidad:</strong> ${specialtyLabel}</p>
            <p><strong>Fecha y Hora:</strong> ${formattedDate} a las ${data.time}</p>
        `;
    };

    // Listeners para cerrar el modal
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Cerrar modal con la tecla Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Función para manejar LocalStorage
    const saveBookingToLocalStorage = (bookingData) => {
        // Obtener citas existentes o inicializar array
        const existingBookings = JSON.parse(localStorage.getItem('mediDentalBookings')) || [];
        
        // Añadir ID único y timestamp
        const newBooking = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...bookingData
        };

        // Guardar array actualizado
        existingBookings.push(newBooking);
        localStorage.setItem('mediDentalBookings', JSON.stringify(existingBookings));
        
        console.log('Cita guardada en localStorage:', newBooking);
    };
});
