// Authentication Logic and Form Validation

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Regex Patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // Min 6 chars, 1 uppercase, 1 number

function showError(inputId, hasError) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`error-${inputId}`);
    
    if (hasError) {
        input.classList.add('c-form__input--error');
        errorSpan.style.display = 'block';
    } else {
        input.classList.remove('c-form__input--error');
        errorSpan.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    if (!EMAIL_REGEX.test(email)) {
        showError('email', true);
        isValid = false;
    } else {
        showError('email', false);
    }
    
    if (password.length < 6) {
        showError('password', true);
        isValid = false;
    } else {
        showError('password', false);
    }
    
    if (isValid) {
        // Simulate Login
        const user = { email: email, name: email.split('@')[0], role: email === 'admin@market.com' ? 'admin' : 'user' };
        localStorage.setItem(STORE_KEYS.USER, JSON.stringify(user));
        
        alert('Inicio de sesión exitoso');
        window.location.href = 'index.html';
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    let isValid = true;
    
    if (name.length < 2) {
        showError('name', true);
        isValid = false;
    } else {
        showError('name', false);
    }
    
    if (!EMAIL_REGEX.test(email)) {
        showError('email', true);
        isValid = false;
    } else {
        showError('email', false);
    }
    
    if (!PASSWORD_REGEX.test(password)) {
        showError('password', true);
        isValid = false;
    } else {
        showError('password', false);
    }
    
    if (password !== passwordConfirm || passwordConfirm === '') {
        showError('password-confirm', true);
        isValid = false;
    } else {
        showError('password-confirm', false);
    }
    
    if (isValid) {
        // Simulate Register
        const user = { email: email, name: name, role: 'user' };
        localStorage.setItem(STORE_KEYS.USER, JSON.stringify(user));
        
        alert('Cuenta creada exitosamente');
        window.location.href = 'index.html';
    }
}
