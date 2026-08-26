/**
 * Lógica Principal - ConsultingPro
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initCurrentYear();
});

/**
 * Inicializa el menú móvil (Hamburguesa)
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navbar = document.getElementById('navbar');
    
    if (!menuToggle || !navbar) return;

    // Abrir/Cerrar menú
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('is-active');
    });

    // Cerrar menú al hacer clic fuera (mejor UX)
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target) && navbar.classList.contains('is-active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navbar.classList.remove('is-active');
        }
    });
}

/**
 * Inicializa el Smooth Scroll y cierre automático del menú móvil al navegar
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navbar = document.getElementById('navbar');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Cerrar menú móvil si está abierto
                if (navbar && navbar.classList.contains('is-active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navbar.classList.remove('is-active');
                }

                // Cálculo del offset por el header fixed
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializa la validación del formulario de contacto
 */
function initFormValidation() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Obtener valores
        const name = document.getElementById('name');
        const company = document.getElementById('company');
        const email = document.getElementById('email');
        const service = document.getElementById('service');

        // Resetear errores previos
        clearErrors();

        // Validar Nombre
        if (name.value.trim() === '') {
            showError('error-name', 'El nombre es obligatorio.');
            isValid = false;
        }

        // Validar Empresa
        if (company.value.trim() === '') {
            showError('error-company', 'El nombre de la empresa es obligatorio.');
            isValid = false;
        }

        // Validar Email (expresión regular básica)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError('error-email', 'El correo electrónico es obligatorio.');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError('error-email', 'Ingrese un correo electrónico válido.');
            isValid = false;
        }

        // Validar Servicio
        if (service.value === '') {
            showError('error-service', 'Por favor, seleccione un área de interés.');
            isValid = false;
        }

        // Si es válido, simular envío
        if (isValid) {
            const submitBtn = form.querySelector('.form__submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            // Simular petición asíncrona
            setTimeout(() => {
                alert('¡Gracias por su interés! Su solicitud ha sido enviada con éxito. Un socio se comunicará pronto para la sesión de diagnóstico.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

/**
 * Muestra el mensaje de error en el span correspondiente
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Limpia todos los mensajes de error del formulario
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.form__error');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}

/**
 * Actualiza dinámicamente el año en el footer
 */
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
