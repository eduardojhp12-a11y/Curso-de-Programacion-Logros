/* ==========================================================================
   Fase 3 y 4: Datos, Renderizado, Filtrado, SPA y Favoritos (Completo)
   ========================================================================== */

// 1. Datos
const propertiesData = [
    {
        id: 1,
        title: "Villa Moderna en la Costa",
        price: 1250000,
        type: "casa",
        bedrooms: 4,
        bathrooms: 3,
        area: 350,
        amenities: ["piscina", "estacionamiento"],
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Espectacular villa de diseño contemporáneo con vistas panorámicas al océano. Cuenta con acabados de lujo, amplios ventanales y una piscina desbordante infinita.",
        featured: true
    },
    {
        id: 2,
        title: "Penthouse de Lujo en el Centro",
        price: 2500000,
        type: "apartamento",
        bedrooms: 3,
        bathrooms: 3,
        area: 280,
        amenities: ["estacionamiento"],
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Exclusivo penthouse ubicado en el distrito financiero. Disfruta de un diseño de concepto abierto, terraza privada y acceso directo a los mejores restaurantes de la ciudad.",
        featured: true
    },
    {
        id: 3,
        title: "Estudio Minimalista con Vistas",
        price: 320000,
        type: "estudio",
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        amenities: [],
        image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Estudio moderno ideal para solteros o parejas jóvenes. Diseño optimizado que maximiza el espacio natural, con acabados minimalistas y domótica integrada.",
        featured: false
    },
    {
        id: 4,
        title: "Residencia Clásica con Jardín",
        price: 850000,
        type: "casa",
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        amenities: ["estacionamiento"],
        image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Hermosa propiedad de estilo clásico rodeada de extensos jardines. Ideal para familias grandes que buscan tranquilidad sin alejarse demasiado de la ciudad.",
        featured: true
    },
    {
        id: 5,
        title: "Apartamento Smart en Zona Exclusiva",
        price: 950000,
        type: "apartamento",
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        amenities: ["piscina", "estacionamiento"],
        image: "https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Apartamento totalmente inteligente equipado con lo último en tecnología para el hogar. El edificio ofrece amenidades de primer nivel como gimnasio, spa y piscina.",
        featured: false
    },
    {
        id: 6,
        title: "Mansión Contemporánea",
        price: 4500000,
        type: "casa",
        bedrooms: 6,
        bathrooms: 7,
        area: 850,
        amenities: ["piscina", "estacionamiento"],
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "La joya de nuestro catálogo. Una mansión impresionante con cine privado, cava de vinos, enorme piscina y estacionamiento para múltiples vehículos. Pura exclusividad.",
        featured: false
    }
];

// 2. Estado Global (State)
const state = {
    // Inicializar favoritos desde LocalStorage o array vacío
    favorites: JSON.parse(localStorage.getItem('luxeFavorites')) || [],
    currentView: 'home', // 'home', 'catalog', 'property-detail'
    showingOnlyFavorites: false
};

// Utilidad Formateo Moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(value);
};

// ==========================================================================
//   Renderizado de Tarjetas y DOM
// ==========================================================================

const createPropertyCard = (property) => {
    const isFav = state.favorites.includes(property.id);
    const favClass = isFav ? 'fav-active' : '';
    // Representación simple del icono del botón de favoritos
    const favIcon = isFav ? '❤️' : '🤍';

    return `
        <article class="property-card" data-id="${property.id}">
            <div class="property-card__image-wrapper">
                <img src="${property.image}" alt="${property.title}" class="property-card__image" loading="lazy">
                
                <!-- Botón de favorito posicionado absolutamente -->
                <button class="property-card__fav-btn ${favClass}" onclick="toggleFavorite(${property.id}, event)" aria-label="Agregar a favoritos" style="position:absolute; top:10px; right:10px; font-size:1.5rem; background:rgba(255,255,255,0.8); border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition: transform 0.2s;">
                    ${favIcon}
                </button>
            </div>
            <div class="property-card__content">
                <p class="property-card__price">${formatCurrency(property.price)}</p>
                <h3 class="property-card__title">${property.title}</h3>
                <ul class="property-card__features" aria-label="Características de la propiedad">
                    <li class="property-card__feature">${property.bedrooms} Hab.</li>
                    <li class="property-card__feature">${property.bathrooms} Baños</li>
                    <li class="property-card__feature">${property.area} m²</li>
                </ul>
                <button class="button button--primary button--full-width property-card__action" onclick="viewPropertyDetails(${property.id})">
                    Ver detalles
                </button>
            </div>
        </article>
    `;
};

const renderProperties = (propertiesArray, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (propertiesArray.length === 0) {
        container.innerHTML = '<p class="catalog-results__empty">No se encontraron propiedades con los filtros seleccionados.</p>';
        return;
    }
    container.innerHTML = propertiesArray.map(createPropertyCard).join('');
};

// ==========================================================================
//   Sistema de Favoritos (LocalStorage)
// ==========================================================================

window.toggleFavorite = (id, event) => {
    event.stopPropagation(); // Evitar comportamientos indeseados
    if (state.favorites.includes(id)) {
        // Quitar de favoritos
        state.favorites = state.favorites.filter(favId => favId !== id);
    } else {
        // Agregar a favoritos
        state.favorites.push(id);
    }
    // Persistir en LocalStorage
    localStorage.setItem('luxeFavorites', JSON.stringify(state.favorites));
    
    // Re-renderizar las vistas afectadas
    renderProperties(propertiesData.filter(p => p.featured), 'featured-grid');
    if (state.currentView === 'catalog') {
        applyFilters(); 
    }
};

// ==========================================================================
//   Navegación SPA (Single-Page Application)
// ==========================================================================

const sections = {
    home: document.getElementById('home'),
    catalog: document.getElementById('catalog'),
    detail: document.getElementById('property-detail')
};

window.navigateTo = (viewId, isFavoritesView = false) => {
    // Ocultar todas las secciones
    Object.values(sections).forEach(sec => {
        if(sec) sec.style.display = 'none';
    });
    
    // Mostrar la solicitada y scrollear arriba
    if (sections[viewId]) {
        sections[viewId].style.display = 'block';
        window.scrollTo(0, 0);
    }
    state.currentView = viewId;
    
    // Si entramos al catálogo, ajustamos si es la vista normal o la de favoritos
    if (viewId === 'catalog') {
        state.showingOnlyFavorites = isFavoritesView;
        const titleEl = document.querySelector('.catalog-section__title');
        if (titleEl) titleEl.textContent = isFavoritesView ? 'Mis Favoritos' : 'Nuestro Catálogo';
        applyFilters(); // Aplica la inyección y filtros automáticamente
    }
};

window.viewPropertyDetails = (id) => {
    const property = propertiesData.find(p => p.id === id);
    if (!property) return;
    
    // Inyectar datos en el DOM de la vista de detalle
    document.getElementById('detail-title').textContent = property.title;
    document.getElementById('detail-price').textContent = formatCurrency(property.price);
    document.getElementById('detail-description').textContent = property.description;
    document.getElementById('detail-main-image').src = property.image;
    
    const featuresList = document.getElementById('detail-features-list');
    featuresList.innerHTML = `
        <li>${property.bedrooms} Habitaciones</li>
        <li>${property.bathrooms} Baños</li>
        <li>${property.area} m² de área</li>
        <li>Tipo: ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</li>
    `;
    
    // Añadir comodidades como elementos de lista adicionales
    property.amenities.forEach(am => {
        const li = document.createElement('li');
        li.textContent = am.charAt(0).toUpperCase() + am.slice(1);
        featuresList.appendChild(li);
    });

    // Navegar a la vista de detalles
    navigateTo('detail');
};

// ==========================================================================
//   Motor de Filtrado del Catálogo
// ==========================================================================

const applyFilters = () => {
    const form = document.getElementById('catalog-filter-form');
    if(!form) return;
    
    // Valores de Checkboxes (Tipo)
    const typeCheckboxes = form.querySelectorAll('input[name="type"]:checked');
    const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);
    
    // Valores de Checkboxes (Comodidades)
    const amenitiesCheckboxes = form.querySelectorAll('input[name="amenities"]:checked');
    const selectedAmenities = Array.from(amenitiesCheckboxes).map(cb => cb.value);
    
    // Valores del Rango de Precios
    const minPrice = parseFloat(document.getElementById('filter-price-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('filter-price-max').value) || Infinity;
    
    // Proceso de filtrado
    let filtered = propertiesData.filter(property => {
        
        // Filtro 1: Modo "Solo favoritos"
        if (state.showingOnlyFavorites && !state.favorites.includes(property.id)) return false;
        
        // Filtro 2: Tipo de propiedad
        if (selectedTypes.length > 0 && !selectedTypes.includes(property.type)) return false;
        
        // Filtro 3: Rango de precio
        if (property.price < minPrice || property.price > maxPrice) return false;
        
        // Filtro 4: Comodidades (debe incluir todas las seleccionadas)
        if (selectedAmenities.length > 0) {
            const hasAllAmenities = selectedAmenities.every(am => property.amenities.includes(am));
            if (!hasAllAmenities) return false;
        }
        
        return true;
    });

    renderProperties(filtered, 'catalog-grid');
};

// ==========================================================================
//   Inicialización de la Aplicación y Event Listeners
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Listeners para Navegación del Header (SPA)
    document.querySelectorAll('.header__nav-link, .header__logo-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').replace('#', '');
            
            if (target === 'home') navigateTo('home');
            if (target === 'catalog') navigateTo('catalog', false);
            if (target === 'favorites') navigateTo('catalog', true); 
        });
    });

    // 2. Botón Volver de Detalles
    const btnBack = document.getElementById('btn-back-catalog');
    if(btnBack) {
        btnBack.addEventListener('click', () => {
            navigateTo('catalog', state.showingOnlyFavorites);
        });
    }

    // 3. Listener para el buscador rápido en el Hero (Home)
    const heroForm = document.querySelector('.hero__search-form');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('property-type-hero').value;
            const maxBudget = document.getElementById('budget-hero').value;
            
            // Sincronizar búsqueda del hero con la barra lateral del catálogo
            const catalogForm = document.getElementById('catalog-filter-form');
            if(catalogForm) catalogForm.reset();
            
            if(type) {
                const typeCheckbox = document.getElementById(`filter-type-${type}`);
                if(typeCheckbox) typeCheckbox.checked = true;
            }
            if(maxBudget) {
                document.getElementById('filter-price-max').value = maxBudget;
            }
            
            // Navegar y aplicar filtros
            navigateTo('catalog');
        });
    }

    // 4. Listeners para aplicar filtros en tiempo real
    const filterInputs = document.querySelectorAll('#catalog-filter-form input');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters); // checkboxes
        input.addEventListener('input', applyFilters);  // inputs number
    });
    
    // 5. Simulación de envío del formulario de contacto
    const contactForm = document.getElementById('schedule-visit-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("¡Solicitud enviada! Nos pondremos en contacto pronto para agendar tu visita.");
            contactForm.reset();
        });
    }

    // 6. Render inicial de la aplicación
    renderProperties(propertiesData.filter(p => p.featured), 'featured-grid');
    // Nota: El catálogo se inyectará cuando el usuario navegue a él a través de `navigateTo`
});
