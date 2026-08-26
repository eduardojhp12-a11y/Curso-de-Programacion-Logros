document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Menú Sticky
    const header = document.querySelector('.js-header');
    
    const toggleStickyHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', toggleStickyHeader);
    // Ejecutar al cargar por si la página ya está scrolleada
    toggleStickyHeader();

    // 2. Scroll Suave entre Secciones (fallback e intercepción)
    const menuLinks = document.querySelectorAll('.header__menu-link, .header__cta, .hero__actions a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Solo actuar en enlaces internos
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Animación de Métricas (Intersection Observer)
    const metricCards = document.querySelectorAll('.metric-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const metricsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    metricCards.forEach(card => {
        metricsObserver.observe(card);
    });

    // 4. Validación Visual del Formulario de Contacto
    const form = document.querySelector('.js-contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Elementos del formulario
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const companyInput = document.getElementById('company');
            const messageInput = document.getElementById('message');
            
            // Función de validación y mostrar error
            const validateField = (input, errorSelector, condition, errorMessage) => {
                const errorElement = document.querySelector(errorSelector);
                if (condition) {
                    input.classList.remove('is-invalid');
                    errorElement.textContent = '';
                } else {
                    input.classList.add('is-invalid');
                    errorElement.textContent = errorMessage;
                    isValid = false;
                }
            };
            
            // Validar Nombre
            validateField(
                nameInput, 
                '.js-error-name', 
                nameInput.value.trim().length >= 3, 
                'Por favor, ingresa tu nombre (mínimo 3 caracteres).'
            );
            
            // Validar Email Corporativo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(
                emailInput, 
                '.js-error-email', 
                emailRegex.test(emailInput.value.trim()), 
                'Ingresa un correo electrónico corporativo válido.'
            );
            
            // Validar Empresa
            validateField(
                companyInput, 
                '.js-error-company', 
                companyInput.value.trim().length >= 2, 
                'Ingresa el nombre de tu empresa.'
            );
            
            // Validar Mensaje
            validateField(
                messageInput, 
                '.js-error-message', 
                messageInput.value.trim().length >= 10, 
                'Cuéntanos un poco más sobre tus objetivos (mínimo 10 caracteres).'
            );
            
            // Si es válido, simular envío
            if (isValid) {
                const btnSubmit = form.querySelector('button[type="submit"]');
                const originalText = btnSubmit.textContent;
                
                btnSubmit.textContent = 'Enviando...';
                btnSubmit.style.opacity = '0.7';
                btnSubmit.disabled = true;
                
                // Simulación de petición de red
                setTimeout(() => {
                    form.reset();
                    btnSubmit.textContent = '¡Solicitud Enviada!';
                    btnSubmit.style.backgroundColor = '#10B981'; // Verde de éxito
                    btnSubmit.style.opacity = '1';
                    
                    setTimeout(() => {
                        btnSubmit.textContent = originalText;
                        btnSubmit.style.backgroundColor = '';
                        btnSubmit.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
        
        // Quitar errores al escribir
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                    const errorElement = document.querySelector(`.js-error-${input.id}`);
                    if (errorElement) errorElement.textContent = '';
                }
            });
        });
    }
});
