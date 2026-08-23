const database = [
    { id: 'm2', title: 'Interstellar', type: 'movie', genre: 'scifi', year: '2014', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', bg: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', rating: '13+', duration: '2h 49m', synopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.' },
    { id: 'm3', title: 'Inception', type: 'movie', genre: 'scifi', year: '2010', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', rating: '13+', duration: '2h 28m', synopsis: 'Un ladrón que roba secretos corporativos a través de los sueños.' },
    { id: 'm4', title: 'Blade Runner 2049', type: 'movie', genre: 'scifi', year: '2017', poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', bg: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', rating: '16+', duration: '2h 44m', synopsis: 'Un nuevo blade runner desentierra un secreto que puede sumergir a la sociedad en el caos.' },
    { id: 'm12', title: 'Dune: Parte Dos', type: 'movie', genre: 'scifi', year: '2024', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', bg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', rating: '13+', duration: '2h 46m', synopsis: 'El duque Paul Atreides se une a los Fremen para convertirse en Muad\'Dib.' }
];

let myWatchList = JSON.parse(localStorage.getItem('streamvibe_watchlist')) || ['m12', 'm2'];

function navigateTo(viewId, itemId = null) {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
        view.classList.remove('view--active');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('view--active');
        window.scrollTo(0, 0);
    }

    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('nav__link--active');
        if(link.getAttribute('href') === `#${viewId}`) {
            link.classList.add('nav__link--active');
        }
    });

    if (viewId === 'detail' && itemId) renderDetailView(itemId);
    if (viewId === 'mylist') renderMyList();
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    if (hash.startsWith('detail/')) {
        navigateTo('detail', hash.split('/')[1]);
    } else {
        navigateTo(hash);
    }
});

function toggleWatchlist(id) {
    const index = myWatchList.indexOf(id);
    if (index > -1) {
        myWatchList.splice(index, 1);
    } else {
        myWatchList.push(id);
    }
    localStorage.setItem('streamvibe_watchlist', JSON.stringify(myWatchList));
    
    if (window.location.hash === '#mylist') renderMyList();
    showToast(index > -1 ? 'Eliminado de Mi Lista' : 'Añadido a Mi Lista');
}

function renderMyList() {
    const grid = document.getElementById('mylist-grid');
    const emptyState = document.getElementById('mylist-empty');
    grid.innerHTML = '';
    
    if (myWatchList.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    myWatchList.forEach(id => {
        const item = database.find(media => media.id === id);
        if (item) {
            const cardHTML = `
                <article class="movie-card" data-id="${item.id}" tabindex="0" role="listitem">
                    <div class="movie-card__poster">
                        <img src="${item.poster}" alt="Póster de ${item.title}" loading="lazy">
                        <div class="movie-card__overlay">
                            <button class="movie-card__play" aria-label="Reproducir"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
                            <button class="movie-card__remove" data-remove="${item.id}" aria-label="Eliminar" title="Eliminar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>
                    <h3 class="movie-card__title">${item.title}</h3>
                </article>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}

function renderDetailView(id) {
    const item = database.find(media => media.id === id) || database[3];
    const detailView = document.getElementById('view-detail');
    
    detailView.querySelector('.detail-hero__bg-img').src = item.bg;
    detailView.querySelector('.detail-hero__poster img').src = item.poster;
    detailView.querySelector('.detail-hero__title').textContent = item.title;
    detailView.querySelector('.detail-hero__synopsis p').textContent = item.synopsis;
    detailView.querySelector('.detail-hero__rating').textContent = item.rating;
    
    const btnWatchlist = document.getElementById('detail-watchlist-btn');
    btnWatchlist.setAttribute('onclick', `toggleWatchlist('${item.id}')`);
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('toast--visible'), 100);
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

document.addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (card && !e.target.closest('button')) {
        const id = card.getAttribute('data-id');
        window.location.hash = `detail/${id}`;
    }

    const removeBtn = e.target.closest('.movie-card__remove');
    if (removeBtn) {
        e.stopPropagation();
        toggleWatchlist(removeBtn.getAttribute('data-remove'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1) || 'home';
    if (hash.startsWith('detail/')) {
        navigateTo('detail', hash.split('/')[1]);
    } else {
        navigateTo(hash);
    }
});