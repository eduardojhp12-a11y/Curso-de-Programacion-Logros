/**
 * Lógica Principal del Portal de Fundación Esperanza
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Animación de Contadores (Métricas en index.html)
    const counters = document.querySelectorAll('.metric__number');
    const speed = 200; // Velocidad de la animación

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
    };

    // Usar Intersection Observer para iniciar animación cuando sean visibles
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(metricsSection);
    }

    // 2. Lógica del Portal de Donaciones (donar.html)
    const donationForm = document.getElementById('donationForm');
    
    if (donationForm) {
        const typeButtons = document.querySelectorAll('#donationTypeGroup .btn-toggle');
        const donationTypeInput = document.getElementById('donationType');
        
        const amountButtons = document.querySelectorAll('.btn-amount');
        const customAmountInput = document.getElementById('customAmount');
        const finalAmountInput = document.getElementById('finalAmount');
        const submitBtnAmount = document.getElementById('submitBtnAmount');
        const impactResult = document.getElementById('impactResult');
        
        // Calculadora de Impacto
        const updateImpactMessage = (amount) => {
            let message = '';
            const value = parseInt(amount);
            
            if (isNaN(value) || value <= 0) {
                message = 'Por favor, ingresa un monto válido.';
            } else if (value < 20) {
                message = `✨ Tu donación de $${value} provee útiles escolares a un niño por un mes.`;
            } else if (value < 50) {
                message = `🍽️ Tu donación de $${value} alimenta a una familia entera durante una semana.`;
            } else if (value < 100) {
                message = `🎒 Tu donación de $${value} garantiza educación integral a 3 niños por todo un trimestre.`;
            } else if (value < 250) {
                message = `🏥 Tu donación de $${value} permite una jornada médica completa en una comunidad remota.`;
            } else {
                message = `🌟 ¡Increíble! Tu donación de $${value} tiene un impacto estructural, ayudándonos a construir aulas y clínicas.`;
            }
            
            impactResult.innerHTML = message;
            submitBtnAmount.innerText = value || '0';
            finalAmountInput.value = value || '0';
        };

        // Inicializar impacto con el monto por defecto
        updateImpactMessage(50);

        // Selector de Tipo (Única / Mensual)
        typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                typeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                donationTypeInput.value = e.target.dataset.type;
            });
        });

        // Selector de Monto Predefinido
        amountButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                amountButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                customAmountInput.value = ''; // Limpiar campo personalizado
                const amount = e.target.dataset.amount;
                updateImpactMessage(amount);
            });
        });

        // Input de Monto Personalizado
        customAmountInput.addEventListener('input', (e) => {
            amountButtons.forEach(b => b.classList.remove('active'));
            const amount = e.target.value;
            if (amount) {
                updateImpactMessage(amount);
            } else {
                updateImpactMessage(0);
            }
        });

        // Simulación de Envío y Pago
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSubmit = donationForm.querySelector('.btn--submit');
            const messageDiv = document.getElementById('formMessage');
            
            // Validaciones básicas de simulación
            const cardNumber = document.getElementById('cardNumber').value;
            if (cardNumber.replace(/\s/g, '').length < 15) {
                messageDiv.className = 'form-message error';
                messageDiv.innerText = 'Por favor ingresa un número de tarjeta válido.';
                return;
            }

            // Simulación de carga
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Procesando Pago...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                
                // Guardar registro simulado
                const amount = finalAmountInput.value;
                const type = donationTypeInput.value;
                const name = document.getElementById('firstName').value;
                
                const donationRecord = {
                    id: Date.now(),
                    name: name,
                    amount: amount,
                    type: type,
                    date: new Date().toLocaleDateString()
                };
                
                let donations = JSON.parse(localStorage.getItem('donations_history')) || [];
                donations.push(donationRecord);
                localStorage.setItem('donations_history', JSON.stringify(donations));

                // Mostrar éxito
                donationForm.reset();
                amountButtons.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-amount="50"]').classList.add('active');
                updateImpactMessage(50);

                messageDiv.className = 'form-message success';
                messageDiv.innerHTML = `¡Gracias, ${name}! Tu donación ${type === 'mensual' ? 'mensual ' : ''}de $${amount} ha sido procesada con éxito. 💚`;
                
                setTimeout(() => {
                    messageDiv.className = 'form-message';
                    messageDiv.innerText = '';
                }, 8000);
            }, 2000);
        });

        // Formateo de tarjeta de crédito visual
        const cardInput = document.getElementById('cardNumber');
        cardInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
        });

        const expiryInput = document.getElementById('expiry');
        expiryInput.addEventListener('input', function (e) {
            let val = e.target.value.replace(/[^\d]/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }

    // 3. Lógica del Voluntariado (voluntariado.html)
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSubmit = volunteerForm.querySelector('.btn--submit');
            const messageDiv = document.getElementById('volMessage');
            
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Enviando...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                
                // Guardar registro en LocalStorage
                const name = document.getElementById('volNombre').value;
                const email = document.getElementById('volEmail').value;
                const phone = document.getElementById('volPhone').value;
                const area = document.getElementById('volArea').value;
                const availability = document.getElementById('volDisponibilidad').value;
                
                const volunteerRecord = {
                    id: Date.now(),
                    name,
                    email,
                    phone,
                    area,
                    availability,
                    date: new Date().toLocaleDateString()
                };
                
                let volunteers = JSON.parse(localStorage.getItem('volunteers_list')) || [];
                volunteers.push(volunteerRecord);
                localStorage.setItem('volunteers_list', JSON.stringify(volunteers));

                // Mostrar éxito
                volunteerForm.reset();
                messageDiv.className = 'form-message success';
                messageDiv.innerHTML = `¡Gracias por unirte, ${name}! Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto.`;
                
                setTimeout(() => {
                    messageDiv.className = 'form-message';
                    messageDiv.innerText = '';
                }, 8000);
            }, 1500);
        });
    }
});
