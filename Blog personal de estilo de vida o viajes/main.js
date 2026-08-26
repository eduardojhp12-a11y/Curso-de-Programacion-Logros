document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('header__nav--active');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // 2. Destination Filtering
  const filterBar = document.getElementById('filterBar');
  const destinationsGrid = document.getElementById('destinationsGrid');

  if (filterBar && destinationsGrid) {
    const filterBtns = filterBar.querySelectorAll('.filter-btn');
    const cards = destinationsGrid.querySelectorAll('.card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        // Add active class to clicked
        btn.classList.add('filter-btn--active');

        const filterValue = btn.getAttribute('data-filter');

        cards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    
    // Check URL parameters for initial filter (e.g., from Home page popular destinations)
    const urlParams = new URLSearchParams(window.location.search);
    const continent = urlParams.get('continent');
    if (continent) {
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${continent}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  // 3. Bookmarks System (LocalStorage)
  const getBookmarks = () => JSON.parse(localStorage.getItem('travel_bookmarks')) || [];
  const setBookmarks = (bookmarks) => localStorage.setItem('travel_bookmarks', JSON.stringify(bookmarks));

  const updateBookmarkUI = () => {
    const bookmarks = getBookmarks();
    document.querySelectorAll('.btn-bookmark').forEach(btn => {
      const id = btn.getAttribute('data-id');
      const isBookmarked = bookmarks.some(b => b.id === id);
      
      if (isBookmarked) {
        btn.style.opacity = '1';
        btn.style.color = 'var(--color-accent-primary)';
      } else {
        btn.style.opacity = '';
        btn.style.color = '';
      }
    });
  };

  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      let bookmarks = getBookmarks();
      const isBookmarked = bookmarks.some(b => b.id === id);

      if (isBookmarked) {
        // Remove bookmark
        bookmarks = bookmarks.filter(b => b.id !== id);
      } else {
        // Add bookmark - extract data based on context (Card vs Post)
        let bookmarkData = { id };
        
        const card = btn.closest('.card');
        if (card) {
          bookmarkData = {
            id,
            imgSrc: card.querySelector('.card__img').src,
            tag: card.querySelector('.card__tag').innerText,
            title: card.querySelector('.card__title').innerText,
            url: card.querySelector('.card__title a').href,
            excerpt: card.querySelector('.card__excerpt').innerText,
            date: card.querySelector('.card__date').innerText
          };
        } else {
          // Context is post.html
          const bgImage = document.querySelector('.post-header__bg').style.backgroundImage;
          const imgSrc = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
          bookmarkData = {
            id,
            imgSrc: imgSrc,
            tag: document.querySelector('.post-tag').innerText,
            title: document.querySelector('.post-title').innerText,
            url: window.location.href,
            excerpt: "Artículo guardado desde la vista de lectura completa.",
            date: document.querySelector('.post-meta span:nth-child(3)').innerText
          };
        }
        bookmarks.push(bookmarkData);
      }

      setBookmarks(bookmarks);
      updateBookmarkUI();
      
      // If we are on favoritos.html, re-render
      if (document.getElementById('favoritesGrid')) {
        renderFavorites();
      }
    });
  });

  // Initial UI sync
  updateBookmarkUI();

  // 4. Render Favorites on favoritos.html
  const renderFavorites = () => {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;

    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
      favoritesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 1.25rem;">Aún no has guardado ningún artículo en tus favoritos.</p>';
      return;
    }

    favoritesGrid.innerHTML = '';
    
    bookmarks.forEach(b => {
      const html = `
        <article class="card">
          <img src="${b.imgSrc}" alt="${b.title}" class="card__img">
          <div class="card__content">
            <span class="card__tag">${b.tag}</span>
            <h3 class="card__title"><a href="${b.url}">${b.title}</a></h3>
            <p class="card__excerpt">${b.excerpt}</p>
            <div class="card__meta">
              <span class="card__date">${b.date}</span>
              <button class="card__bookmark btn-bookmark" aria-label="Quitar de favoritos" data-id="${b.id}">🔖</button>
            </div>
          </div>
        </article>
      `;
      favoritesGrid.insertAdjacentHTML('beforeend', html);
    });

    // Attach listeners to new dynamically rendered buttons
    favoritesGrid.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        let currentBookmarks = getBookmarks();
        currentBookmarks = currentBookmarks.filter(b => b.id !== id);
        setBookmarks(currentBookmarks);
        renderFavorites(); // Re-render to reflect removal
      });
      // Sync styles immediately
      btn.style.opacity = '1';
      btn.style.color = 'var(--color-accent-primary)';
    });
  };

  renderFavorites();

});
