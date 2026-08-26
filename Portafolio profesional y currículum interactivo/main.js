/**
 * main.js - Portafolio Profesional
 * Escrito en Vanilla JS (ES6+) sin librerías externas.
 * Contiene lógica de navegación, Modal y validación de formulario.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModal();
    initFormValidation();
});

/**
 * 1. Navegación e Intersection Observer
 * Actualiza el estado activo de los enlaces en el navbar según el scroll.
 */
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');

    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50% 0px', // Ajuste para mejorar la precisión al scrollear
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveLink(currentId);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateActiveLink(id) {
        navLinks.forEach(link => {
            // Resetea todos
            link.style.color = 'var(--color-text-secondary)';
            // Activa el correspondiente
            if (link.getAttribute('href') === `#${id}`) {
                link.style.color = 'var(--color-primary)';
            }
        });
    }
}

/**
 * 2. Galería de Proyectos y Modal Interactivo
 * Mapeo de datos dinámico y control del elemento <dialog>
 */
function initModal() {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = modal.querySelector('.modal__description');
    const modalCloseBtn = modal.querySelector('.modal__close');
    const projectBtns = document.querySelectorAll('.project-card__btn');

    // Base de datos simulada
    const projectsData = {
        '1': {
            title: 'Dashboard Financiero Enterprise',
            description: 'Panel de control de alto rendimiento diseñado para visualizar flujos masivos de datos en tiempo real. Construido con una arquitectura modular, implementando algoritmos de renderizado eficientes y virtualización de listas para garantizar un performance impecable sin frameworks pesados.',
        },
        '2': {
            title: 'Nexus Design System',
            description: 'Sistema de diseño UI/UX agnóstico y accesible. Compuesto por web components puramente nativos, directrices estrictas de tipografía y una paleta de color algorítmica. Ha acelerado los tiempos de prototipado del equipo frontend en un 40%.',
        },
        '3': {
            title: 'Plataforma E-Commerce B2B',
            description: 'Solución integral de comercio electrónico a escala empresarial. Incluye gestión de inventario en tiempo real, flujos de checkout asíncronos resilientes, y métricas perfectas en Web Vitals. Todo manejado bajo patrones de diseño limpios y APIs REST seguras.',
        }
    };

    // Abrir Modal con datos inyectados
    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-project');
            const data = projectsData[projectId];
            
            if (data) {
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.description;
                
                modal.showModal();
            }
        });
    });

    // Cerrar modal vía botón
    modalCloseBtn.addEventListener('click', () => {
        modal.close();
    });

    // Cerrar modal al hacer click fuera del contenedor (en el backdrop)
    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            modal.close();
        }
    });
}

/**
 * 3. Validación de Formulario de Contacto
 * Validación en tiempo real (blur/input) y control de Accesibilidad (ARIA)
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validators = {
        name: {
            fn: (val) => val.length >= 3,
            msg: 'El nombre debe contener al menos 3 caracteres.'
        },
        email: {
            fn: (val) => emailRegex.test(val),
            msg: 'Por favor, ingresa un formato de correo electrónico válido.'
        },
        subject: {
            fn: (val) => val.length >= 4,
            msg: 'El asunto debe tener al menos 4 caracteres.'
        },
        message: {
            fn: (val) => val.length >= 15,
            msg: 'El mensaje debe ser más descriptivo (mínimo 15 caracteres).'
        }
    };

    const validateField = (input, validatorKey) => {
        const errorElement = document.getElementById(`error-${input.id}`);
        const { fn, msg } = validators[validatorKey];
        const val = input.value.trim();

        if (!fn(val)) {
            showError(input, errorElement, msg);
            return false;
        } else {
            clearError(input, errorElement);
            return true;
        }
    };

    function showError(input, errorElement, message) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
    }

    function clearError(input, errorElement) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        errorElement.textContent = '';
    }

    // Configuración de validación asíncrona por eventos
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input, input.id);
        });
        
        input.addEventListener('input', () => {
            // Si estaba en estado de error, validarlo en vivo mientras tipea
            if (input.classList.contains('is-invalid')) {
                validateField(input, input.id);
            }
        });
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isSubjectValid = validateField(subjectInput, 'subject');
        const isMessageValid = validateField(messageInput, 'message');

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            const submitBtn = form.querySelector('.form__submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando petición...';
            submitBtn.disabled = true;

            // Simulación de latencia de red
            setTimeout(() => {
                alert('¡Mensaje enviado exitosamente! Me comunicaré contigo a la brevedad.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Limpiar posibles estados "validos" sobrantes si hubiera 
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    const errorElement = document.getElementById(`error-${input.id}`);
                    clearError(input, errorElement);
                });
            }, 1800);
        }
    });
}
