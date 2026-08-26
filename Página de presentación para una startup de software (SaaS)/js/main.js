document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Mobile Menu (Hamburger)
       ========================================================================== */
    const hamburgerBtn = document.querySelector('.header__hamburger');
    const mobileNav = document.querySelector('.header__nav');
    
    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            
            // Toggle ARIA state
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle classes for visual state
            hamburgerBtn.classList.toggle('header__hamburger--active');
            mobileNav.classList.toggle('header__nav--active');
        });
    }

    /* ==========================================================================
       2. Smooth Scrolling for Anchor Links
       ========================================================================== */
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileNav && mobileNav.classList.contains('header__nav--active')) {
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    hamburgerBtn.classList.remove('header__hamburger--active');
                    mobileNav.classList.remove('header__nav--active');
                }

                // Header offset (height of fixed header)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       3. Pricing Toggle Calculation
       ========================================================================== */
    const billingToggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.pricing-card__amount');
    
    if (billingToggle && priceElements.length > 0) {
        billingToggle.addEventListener('change', () => {
            const isAnnual = billingToggle.checked;
            
            priceElements.forEach(priceEl => {
                const monthlyPrice = priceEl.getAttribute('data-monthly');
                const annualPrice = priceEl.getAttribute('data-annual');
                
                // Animate price change slightly
                priceEl.style.opacity = 0;
                
                setTimeout(() => {
                    priceEl.textContent = isAnnual ? annualPrice : monthlyPrice;
                    priceEl.style.opacity = 1;
                }, 150);
            });
        });
        
        // Add a simple transition to price numbers for smooth effect
        priceElements.forEach(priceEl => {
            priceEl.style.transition = 'opacity 0.15s ease';
        });
    }

    /* ==========================================================================
       4. FAQ Accordion Logic
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-item__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answerId = question.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            
            // Close all other accordions (optional, but good UX)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswerId = otherQuestion.getAttribute('aria-controls');
                    const otherAnswer = document.getElementById(otherAnswerId);
                    
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                        setTimeout(() => {
                            otherAnswer.hidden = true;
                        }, 300); // Matches CSS transition speed
                    }
                }
            });
            
            // Toggle current accordion
            question.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Opening
                answer.hidden = false;
                // Calculate height dynamically for smooth max-height transition
                const scrollHeight = answer.scrollHeight;
                answer.style.maxHeight = scrollHeight + "px";
            } else {
                // Closing
                answer.style.maxHeight = null;
                setTimeout(() => {
                    answer.hidden = true;
                }, 300); // Wait for transition before hiding from accessibility tree
            }
        });
    });
});
