/**
 * Tech & Web Dev News - app.js (Completo - Fase 3 y 4)
 */

// ==========================================================================
// Mock de Datos (Noticias)
// ==========================================================================
const newsData = [
    {
        id: 1,
        title: "El futuro de JavaScript: Novedades en ECMAScript 2026",
        excerpt: "Descubre las nuevas características que llegarán a JavaScript este año. Desde mejoras en el manejo de asincronía hasta nuevos métodos para arrays y objetos.",
        content: `
            <p>La evolución de JavaScript no se detiene. El comité TC39 ha revelado las propuestas que formarán parte de la especificación ECMAScript 2026, prometiendo hacer que el desarrollo web sea más eficiente y expresivo.</p>
            <p>Una de las adiciones más esperadas es la mejora en el manejo de errores en promesas y la sintaxis simplificada para la importación de módulos dinámicos.</p>
            <h2>Ejemplo de sintaxis propuesta:</h2>
            <pre><code>
// Ejemplo conceptual de las nuevas características
async function procesarDatos() {
    try {
        const resultado = await fetchDatos();
        console.log("Datos obtenidos:", resultado);
    } catch {
        // Nuevo 'catch' sin variable obligatorio
        console.error("Hubo un error al procesar.");
    }
}
            </code></pre>
            <p>Estas actualizaciones permitirán a los desarrolladores escribir un código más limpio y con menor probabilidad de errores no controlados, consolidando a JavaScript como el lenguaje rey de la web.</p>
        `,
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
        date: "25 Ago 2026",
        category: "Frontend",
        author: "Ana López"
    },
    {
        id: 2,
        title: "Migración a Rust en el Backend: ¿Vale la pena el esfuerzo?",
        excerpt: "Empresas tecnológicas de primer nivel están reescribiendo sus microservicios críticos en Rust para obtener un rendimiento sin precedentes. Analizamos los pros y los contras.",
        content: `
            <p>La adopción de Rust en el desarrollo backend ha pasado de ser una tendencia de nicho a una estrategia empresarial adoptada por gigantes como Amazon, Microsoft y Cloudflare.</p>
            <p>La promesa de Rust es clara: seguridad de memoria garantizada en tiempo de compilación y un rendimiento que compite de tú a tú con C++, pero sin los dolores de cabeza de los "segmentation faults".</p>
            <h2>Comparativa de Rendimiento</h2>
            <p>En pruebas recientes, microservicios reescritos de Node.js a Rust han mostrado una reducción del 80% en el consumo de memoria y un aumento significativo en la capacidad de manejar concurrencia. Sin embargo, la curva de aprendizaje es pronunciada.</p>
        `,
        image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&q=80&w=800",
        date: "24 Ago 2026",
        category: "Backend",
        author: "Carlos Ruiz"
    },
    {
        id: 3,
        title: "Inteligencia Artificial Generativa aplicada al Diseño UI",
        excerpt: "Nuevas herramientas impulsadas por IA están transformando la forma en que los diseñadores y desarrolladores front-end crean interfaces de usuario, reduciendo el tiempo de prototipado a minutos.",
        content: `
            <p>La integración de modelos de lenguaje grande (LLMs) y generadores de imágenes en herramientas de diseño está democratizando la creación de interfaces de alta calidad.</p>
            <p>Herramientas como Figma han incorporado asistentes virtuales que pueden generar componentes enteros, desde barras de navegación hasta formularios complejos, basándose simplemente en descripciones textuales.</p>
            <h2>Impacto en el Flujo de Trabajo</h2>
            <p>Los desarrolladores Frontend ahora pueden enfocarse más en la arquitectura y la lógica de negocio, delegando la creación inicial de componentes visuales a la Inteligencia Artificial. Esto no reemplaza al desarrollador, sino que eleva sus capacidades.</p>
        `,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        date: "23 Ago 2026",
        category: "IA",
        author: "Elena Martínez"
    },
    {
        id: 4,
        title: "Vulnerabilidades Zero-Day detectadas en frameworks populares",
        excerpt: "Un reporte reciente detalla una serie de fallos críticos de seguridad encontrados en dependencias ampliamente utilizadas en el ecosistema de Node.js. ¿Cómo proteger tus aplicaciones?",
        content: `
            <p>El ecosistema open-source es poderoso, pero también conlleva riesgos si no se auditan adecuadamente las dependencias. Investigadores de ciberseguridad han publicado hallazgos alarmantes sobre librerías populares.</p>
            <p>Las vulnerabilidades permiten ataques de inyección y denegación de servicio (DoS), afectando a miles de aplicaciones en producción.</p>
            <h2>Medidas Mitigadoras</h2>
            <p>Se recomienda encarecidamente a los equipos de desarrollo actualizar a las versiones parcheadas inmediatamente y establecer un monitoreo continuo de dependencias utilizando herramientas de análisis estático (SAST).</p>
        `,
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
        date: "22 Ago 2026",
        category: "Ciberseguridad",
        author: "David Silva"
    },
    {
        id: 5,
        title: "CSS Grid vs Flexbox: Patrones de diseño moderno",
        excerpt: "Aunque ambas tecnologías revolucionaron el diseño web, saber cuándo usar Grid y cuándo Flexbox sigue siendo un tema de debate. Presentamos una guía definitiva con ejemplos prácticos.",
        content: `
            <p>Con el soporte casi universal en navegadores modernos, CSS Grid y Flexbox son las herramientas fundamentales para cualquier desarrollador UI.</p>
            <p>La regla general es simple: <strong>Flexbox</strong> es ideal para diseños unidimensionales (alineación en filas o columnas), mientras que <strong>CSS Grid</strong> brilla en diseños bidimensionales, controlando filas y columnas simultáneamente.</p>
            <h2>El patrón 'Holy Grail' con Grid</h2>
            <pre><code>
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
}
            </code></pre>
            <p>Comprender la sinergia entre ambas herramientas permite crear interfaces fluidas y altamente responsivas con menos líneas de código.</p>
        `,
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
        date: "21 Ago 2026",
        category: "Frontend",
        author: "Sofía Vega"
    },
    {
        id: 6,
        title: "El auge de las Bases de Datos Vectoriales para IA",
        excerpt: "Con la explosión de aplicaciones basadas en LLMs, las bases de datos vectoriales como Pinecone y Milvus se han vuelto esenciales para la búsqueda semántica y la generación aumentada por recuperación (RAG).",
        content: `
            <p>Las bases de datos relacionales tradicionales (SQL) o documentales (NoSQL) no están diseñadas para manejar eficientemente la similitud semántica. Aquí entran en juego las bases de datos vectoriales.</p>
            <p>Almacenando representaciones matemáticas de texto (embeddings), estas bases de datos permiten buscar información basada en el "significado" en lugar de coincidencias exactas de palabras clave.</p>
            <h2>Arquitectura RAG</h2>
            <p>En el contexto del desarrollo backend para IA, conectar tu aplicación a una base de datos vectorial es el paso fundamental para dotar a los modelos de lenguaje de memoria y contexto específico del dominio corporativo.</p>
        `,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
        date: "20 Ago 2026",
        category: "IA",
        author: "Miguel Torres"
    }
];

// ==========================================================================
// Estado y Variables Globales
// ==========================================================================
const appRoot = document.getElementById('app-root');
const themeToggleBtn = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav__link');

let savedArticles = JSON.parse(localStorage.getItem('techNewsFavorites')) || [];

// ==========================================================================
// Utilidades de LocalStorage y Tema
// ==========================================================================
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
}

function toggleFavorite(id) {
    const articleId = parseInt(id, 10);
    const index = savedArticles.indexOf(articleId);
    if (index > -1) {
        savedArticles.splice(index, 1);
    } else {
        savedArticles.push(articleId);
    }
    localStorage.setItem('techNewsFavorites', JSON.stringify(savedArticles));
    
    // Opcional: Actualizar UI si estamos en la vista de favoritos
    const currentView = document.querySelector('.nav__link--active')?.getAttribute('data-view');
    if (currentView === 'favorites') {
        renderFavorites();
    } else {
        updateSaveButtons(articleId);
    }
}

function updateSaveButtons(changedId = null) {
    const saveBtns = document.querySelectorAll('.btn-save');
    saveBtns.forEach(btn => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (changedId === null || changedId === id) {
            btn.textContent = savedArticles.includes(id) ? '🌟' : '🔖';
        }
    });
}

// ==========================================================================
// Funciones de Renderizado
// ==========================================================================

function getCardHTML(article) {
    return `
        <article class="card" data-id="${article.id}">
            <img src="${article.image}" alt="${article.title}" class="card__image">
            <div class="card__content">
                <div class="card__meta">
                    <span class="tag">${article.category}</span>
                    <span>${article.date}</span>
                </div>
                <h3 class="card__title">
                    <a href="#" class="card__title-link" data-id="${article.id}">${article.title}</a>
                </h3>
                <p class="card__excerpt">${article.excerpt}</p>
                <div class="card__footer">
                    <span>Por ${article.author}</span>
                    <button class="btn btn--icon btn-save" data-id="${article.id}" aria-label="Guardar artículo">
                        ${savedArticles.includes(article.id) ? '🌟' : '🔖'}
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderHome() {
    if (!appRoot) return;

    const heroArticle = newsData[0];
    const gridArticles = newsData.slice(1);

    const heroHTML = `
        <article class="hero" data-id="${heroArticle.id}">
            <img src="${heroArticle.image}" alt="${heroArticle.title}" class="hero__image">
            <div class="hero__content">
                <div class="hero__meta">
                    <span class="tag">${heroArticle.category}</span>
                    <span>${heroArticle.date}</span>
                </div>
                <h2 class="hero__title">${heroArticle.title}</h2>
                <p>${heroArticle.excerpt}</p>
            </div>
        </article>
    `;

    let gridHTML = '<div class="news-grid">';
    gridArticles.forEach(article => {
        gridHTML += getCardHTML(article);
    });
    gridHTML += '</div>';

    appRoot.innerHTML = heroHTML + gridHTML;
    attachArticleEvents();
}

function renderSingleArticle(id) {
    const article = newsData.find(a => a.id === parseInt(id, 10));
    if (!article) return;

    appRoot.innerHTML = `
        <div class="article-container">
            <header class="article__header">
                <div class="article__meta" style="margin-bottom: 1rem;">
                    <span class="tag">${article.category}</span>
                </div>
                <h1 class="article__title">${article.title}</h1>
                <div class="article__meta">
                    <span>Por ${article.author}</span>
                    <span>•</span>
                    <span>${article.date}</span>
                </div>
            </header>
            <img src="${article.image}" alt="${article.title}" class="article__image">
            <div class="article__body">
                ${article.content}
            </div>
            <div class="article__actions">
                <button class="btn btn--primary btn-save" data-id="${article.id}">
                    ${savedArticles.includes(article.id) ? '🌟 Guardado' : '🔖 Guardar'}
                </button>
                <button class="btn btn--secondary" onclick="alert('Compartido!')">📤 Compartir</button>
            </div>
        </div>
    `;
    
    // Re-attach event listeners specifically for this view
    const saveBtn = appRoot.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            toggleFavorite(e.currentTarget.getAttribute('data-id'));
            const isSaved = savedArticles.includes(article.id);
            e.currentTarget.innerHTML = isSaved ? '🌟 Guardado' : '🔖 Guardar';
        });
    }
}

function renderCategories(filter = 'Todas') {
    const categories = ['Todas', ...new Set(newsData.map(a => a.category))];
    
    let filtersHTML = '<div class="filters">';
    categories.forEach(cat => {
        const activeClass = cat === filter ? 'filters__btn--active' : 'btn--secondary';
        filtersHTML += `<button class="btn filters__btn ${activeClass}" data-filter="${cat}">${cat}</button>`;
    });
    filtersHTML += '</div>';

    const filteredArticles = filter === 'Todas' ? newsData : newsData.filter(a => a.category === filter);

    let gridHTML = '<div class="news-grid">';
    if (filteredArticles.length === 0) {
        gridHTML += `<div class="empty-state">
                        <h2 class="empty-state__title">No hay artículos</h2>
                        <p class="empty-state__text">No se encontraron artículos para esta categoría.</p>
                     </div>`;
    } else {
        filteredArticles.forEach(article => {
            gridHTML += getCardHTML(article);
        });
    }
    gridHTML += '</div>';

    appRoot.innerHTML = filtersHTML + gridHTML;
    
    // Attach event listeners for category buttons
    const filterBtns = appRoot.querySelectorAll('.filters__btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            renderCategories(e.currentTarget.getAttribute('data-filter'));
        });
    });

    attachArticleEvents();
}

function renderFavorites() {
    const favoriteArticles = newsData.filter(a => savedArticles.includes(a.id));

    let html = '<h1 style="margin-bottom: 2rem; font-family: var(--font-heading);">Tus Artículos Guardados</h1>';
    
    if (favoriteArticles.length === 0) {
        html += `
            <div class="empty-state">
                <h2 class="empty-state__title">Tu lista está vacía</h2>
                <p class="empty-state__text">Explora los artículos y haz clic en el icono 🔖 para guardarlos aquí.</p>
            </div>
        `;
    } else {
        html += '<div class="news-grid">';
        favoriteArticles.forEach(article => {
            html += getCardHTML(article);
        });
        html += '</div>';
    }

    appRoot.innerHTML = html;
    attachArticleEvents();
}

// ==========================================================================
// Navegación y Eventos
// ==========================================================================

function attachArticleEvents() {
    // Para clicks en tarjetas completas (títulos o hero)
    const titleLinks = appRoot.querySelectorAll('.card__title-link, .hero');
    titleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute('data-id');
            if (id) {
                renderSingleArticle(id);
                updateNavState(null); // Quitar selección de la barra superior
            }
        });
    });

    // Para clicks en guardar
    const saveBtns = appRoot.querySelectorAll('.btn-save');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evitar click en la tarjeta o enlace superior
            const id = e.currentTarget.getAttribute('data-id');
            toggleFavorite(id);
        });
    });
}

function updateNavState(viewName) {
    navLinks.forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('nav__link--active');
        } else {
            link.classList.remove('nav__link--active');
        }
    });
}

function navigateTo(viewName) {
    updateNavState(viewName);
    switch(viewName) {
        case 'home':
            renderHome();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'favorites':
            renderFavorites();
            break;
        default:
            renderHome();
    }
}

// ==========================================================================
// Inicialización
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.getAttribute('data-view');
            navigateTo(view);
        });
    });

    document.getElementById('logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });

    // Inicializar vista por defecto
    navigateTo('home');
});
