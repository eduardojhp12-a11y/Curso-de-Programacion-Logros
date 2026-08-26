document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Lógica del Temporizador (Countdown)
    // ==========================================
    const initCountdown = () => {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // Configurar la fecha objetivo (ej. 3 días a partir del acceso a la página)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return; // Opcional: mostrar un mensaje de "El tiempo expiró"
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Formatear a dos dígitos
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        };

        // Ejecutar inmediatamente y luego cada segundo
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    };

    // ==========================================
    // 2. Validación de Formulario y Captura
    // ==========================================
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Regex básico para validación de email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Evitar recarga de la página
        
        let isValid = true;
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();

        // Validar campo de Nombre
        if (nameValue === '') {
            nameInput.classList.add('is-invalid');
            nameError.classList.add('is-visible');
            isValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
            nameError.classList.remove('is-visible');
        }

        // Validar campo de Correo Electrónico
        if (!validateEmail(emailValue)) {
            emailInput.classList.add('is-invalid');
            emailError.classList.add('is-visible');
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailError.classList.remove('is-visible');
        }

        // Procesar si el formulario es válido
        if (isValid) {
            const leadData = {
                fullName: nameValue,
                email: emailValue,
                timestamp: new Date().toISOString()
            };

            // Simular almacenamiento en base de datos guardando en LocalStorage
            localStorage.setItem('lead_' + Date.now(), JSON.stringify(leadData));

            // Resetear el estado visual y los datos del formulario
            form.reset();
            nameInput.classList.remove('is-invalid');
            emailInput.classList.remove('is-invalid');
            nameError.classList.remove('is-visible');
            emailError.classList.remove('is-visible');

            // Mostrar el Modal de Éxito
            successModal.classList.add('is-open');
            successModal.setAttribute('aria-hidden', 'false');
        }
    };

    form.addEventListener('submit', handleFormSubmit);

    // ==========================================
    // 3. Lógica del Modal (Gestión del DOM)
    // ==========================================
    const closeModal = () => {
        successModal.classList.remove('is-open');
        successModal.setAttribute('aria-hidden', 'true');
    };

    // Cerrar al hacer clic en el botón principal
    closeModalBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic en el overlay (fondo oscuro fuera del modal)
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal || e.target.classList.contains('modal__overlay')) {
            closeModal();
        }
    });

    // Cerrar modal al presionar la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // ==========================================
    // Inicialización Principal
    // ==========================================
    initCountdown();
});
