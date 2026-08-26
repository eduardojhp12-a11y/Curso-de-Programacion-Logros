document.addEventListener('DOMContentLoaded', () => {
    // Lógica de Filtrado - Directorio (Fase 2)
    const filterBtn = document.getElementById('apply-filters');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('search').value.toLowerCase();
            const genreSelect = document.getElementById('genre').value;
            const yearSelect = document.getElementById('year').value;
            const statusSelect = document.getElementById('status').value;
            
            const cards = document.querySelectorAll('#anime-grid .card');
            let visibleCount = 0;

            cards.forEach(card => {
                const title = card.querySelector('.card__title').textContent.toLowerCase();
                const genre = card.dataset.genre;
                const year = card.dataset.year;
                const status = card.dataset.status;

                const matchSearch = title.includes(searchInput);
                const matchGenre = genreSelect === 'all' || genre === genreSelect;
                const matchYear = yearSelect === 'all' || year === yearSelect;
                const matchStatus = statusSelect === 'all' || status === statusSelect;

                if (matchSearch && matchGenre && matchYear && matchStatus) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const resultsCount = document.getElementById('results-count');
            if (resultsCount) {
                resultsCount.textContent = visibleCount;
            }
        });
    }

    // Lógica de Reproductor de Video (Fase 3)
    const playOverlay = document.getElementById('play-overlay');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressBar = document.getElementById('progress-bar');
    
    let isPlaying = false;
    let progress = 0;
    let progressInterval;

    const togglePlay = () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playOverlay.style.display = 'none';
            playPauseBtn.textContent = '⏸';
            progressInterval = setInterval(() => {
                progress += 0.5;
                if (progress > 100) progress = 0;
                progressFill.style.width = progress + '%';
            }, 1000);
        } else {
            playOverlay.style.display = 'flex';
            playPauseBtn.textContent = '▶';
            clearInterval(progressInterval);
        }
    };

    if (playOverlay && playPauseBtn) {
        playOverlay.addEventListener('click', togglePlay);
        playPauseBtn.addEventListener('click', togglePlay);
        
        // Simular clic en la barra de progreso
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            progress = (clickX / rect.width) * 100;
            progressFill.style.width = progress + '%';
        });
    }

    // Lógica de Tabs Watchlist (Fase 4)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
            tabContents.forEach(c => c.classList.remove('tab-content--active'));

            // Add active class
            btn.classList.add('tab-btn--active');
            const targetId = btn.dataset.tab;
            document.getElementById(`tab-${targetId}`).classList.add('tab-content--active');
        });
    });

    // Simulador de LocalStorage para Watchlist (Fase 4)
    const mockWatchlist = {
        viendo: [
            { title: 'Hunter x Hunter', ep: 'Episodio 116', img: 'https://via.placeholder.com/225x318/151c27/e1e6f0?text=Hunter+x+Hunter' }
        ],
        completado: [
            { title: 'Dragon Ball Super', ep: 'Episodio 131', img: 'https://via.placeholder.com/225x318/151c27/e1e6f0?text=Dragon+Ball+Super' }
        ],
        plan: [
            { title: 'One Piece', ep: 'Episodio 1', img: 'https://via.placeholder.com/225x318/151c27/e1e6f0?text=One+Piece' }
        ]
    };

    if (!localStorage.getItem('animeWatchlist')) {
        localStorage.setItem('animeWatchlist', JSON.stringify(mockWatchlist));
    }

    const loadWatchlist = () => {
        const data = JSON.parse(localStorage.getItem('animeWatchlist'));
        if(!data) return;
        
        ['viendo', 'completado', 'plan'].forEach(status => {
            const container = document.getElementById(`grid-${status}`);
            const count = document.getElementById(`count-${status}`);
            
            if (container && count) {
                container.innerHTML = '';
                count.textContent = data[status].length;
                
                data[status].forEach(anime => {
                    const article = document.createElement('article');
                    article.className = 'card';
                    article.innerHTML = `
                        <figure class="card__poster">
                            <img src="${anime.img}" alt="${anime.title}">
                        </figure>
                        <div class="card__info">
                            <h3 class="card__title">${anime.title}</h3>
                            <p class="card__meta">${anime.ep}</p>
                        </div>
                    `;
                    container.appendChild(article);
                });
            }
        });
    };

    loadWatchlist();

    // Evento de Añadir a Lista en pagina de Anime (Fase 4)
    const addWatchlistBtn = document.getElementById('add-watchlist');
    
    if (addWatchlistBtn) {
        addWatchlistBtn.addEventListener('click', () => {
            const animeTitle = document.querySelector('.anime-hero__title').textContent;
            const data = JSON.parse(localStorage.getItem('animeWatchlist')) || { viendo: [], completado: [], plan: [] };
            
            const exists = Object.values(data).some(list => list.some(item => item.title === animeTitle));
            
            if (exists) {
                alert('Este anime ya está en tu lista.');
                return;
            }
            
            const newAnime = {
                title: animeTitle,
                ep: 'Episodio 1', // Placeholder
                img: document.querySelector('.anime-hero__poster img').src
            };
            
            data.plan.push(newAnime);
            localStorage.setItem('animeWatchlist', JSON.stringify(data));
            alert('¡Añadido a tu lista (Plan)!');
            
            addWatchlistBtn.textContent = 'Añadido';
            addWatchlistBtn.disabled = true;
        });
    }

    // Lógica del Panel de Administración (Fase 5)
    const deleteBtns = document.querySelectorAll('.action-btn--delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm('¿Estás seguro de borrar este registro?')) {
                const row = e.target.closest('tr');
                if (row) {
                    row.remove();
                    alert('Registro borrado exitosamente');
                }
            }
        });
    });
});
