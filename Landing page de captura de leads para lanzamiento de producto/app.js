document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lead-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const submitBtn = form.querySelector('.lead-form__submit-btn');

    // Validation Rules
    const isValidName = (name) => name.trim().length >= 2;
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // UI Feedback Helpers
    const showError = (input, errorElement, message) => {
        input.classList.add('lead-form__input--error');
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
    };

    const clearError = (input, errorElement) => {
        input.classList.remove('lead-form__input--error');
        input.removeAttribute('aria-invalid');
        errorElement.textContent = '';
    };

    // Real-time Validation
    nameInput.addEventListener('input', () => {
        if (isValidName(nameInput.value)) {
            clearError(nameInput, nameError);
        }
    });

    emailInput.addEventListener('input', () => {
        if (isValidEmail(emailInput.value)) {
            clearError(emailInput, emailError);
        }
    });

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Validate Name
        if (!isValidName(nameInput.value)) {
            showError(nameInput, nameError, 'Por favor, ingresa tu nombre (mínimo 2 caracteres).');
            isFormValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        // Validate Email
        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, emailError, 'Por favor, ingresa un correo electrónico válido.');
            isFormValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Proceed if Valid
        if (isFormValid) {
            // Update button state to simulate loading
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                // Save lead in localStorage
                const lead = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    timestamp: new Date().toISOString()
                };

                const existingLeads = JSON.parse(localStorage.getItem('landingLeads')) || [];
                existingLeads.push(lead);
                localStorage.setItem('landingLeads', JSON.stringify(existingLeads));

                // Success UI Feedback
                form.innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h2 class="lead-form__title" style="margin-bottom: 8px;">¡Gracias por registrarte!</h2>
                        <p class="lead-form__privacy-note">Tu lugar está asegurado. Te contactaremos pronto con más detalles.</p>
                    </div>
                `;
            }, 800);
        }
    });
});
