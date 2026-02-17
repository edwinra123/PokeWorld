const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 1;
const perPage = 20;

export function renderPokeLista() {
    const main = document.getElementById("main-content");

    main.innerHTML = `
        <div class ="div-top">
            <div class="item_flex">
                <div class="input-search-div">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="input-search" id="searchInput" placeholder="Escribe aquí">
                </div>
            </div>
        </div>
        <section class="pokemon-list-section">
            <div class="container_cards">
            
            </div>
            <div class="pagination-container">
                <button class="pagination-btn prev"><i class="fa-solid fa-angle-left"></i></button>
                <div class="numbers"></div>
                <button class="pagination-btn next"><i class="fa-solid fa-angle-right"></i></button>
            </div>
        </section>
    `;

    const searchInput = document.getElementById("searchInput");
    const container = document.querySelector(".container_cards");

    loadPage(currentPage);

    document.querySelector(".prev").addEventListener("click", () => {
        if (currentPage > 1) loadPage(--currentPage);
    });
    document.querySelector(".next").addEventListener("click", () => {
        loadPage(++currentPage);
    });

    searchInput.addEventListener("keydown", async(event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) return;

            container.innerHTML = "<p>Buscando Pokémon...</p>";

            try {
                const res = await fetch(`${POKE_URL}/${query}`);
                if (!res.ok) throw new Error("Pokémon no encontrado");
                const pokeData = await res.json();
                container.innerHTML = "";
                container.appendChild(createCard(pokeData));
                if (localStorage.getItem("compactMode") === "true") {
                    container.classList.add("compacto");
                }
            } catch (err) {
                container.innerHTML = `<p style="color:red;">${err.message}</p>`;
                console.error(err);
            }
        }
    });

    let debounceTimeout;
    searchInput.addEventListener("input", (event) => {
        clearTimeout(debounceTimeout);
        const query = event.target.value.toLowerCase().trim();

        if (!query) {
            loadPage(currentPage);
            return;
        }

        debounceTimeout = setTimeout(async() => {
            try {
                const res = await fetch(`${POKE_URL}?limit=1000`);
                const data = await res.json();
                const results = data.results.filter(p => p.name.startsWith(query));

                container.innerHTML = "";

                if (results.length === 0) {
                    container.innerHTML = "<p style='color:red;'>No se encontraron coincidencias</p>";
                    return;
                }

                for (let i = 0; i < Math.min(10, results.length); i++) {
                    const pokeData = await fetch(results[i].url).then(r => r.json());
                    container.appendChild(createCard(pokeData));
                }

                // Aplicar compacto si está guardado
                if (localStorage.getItem("compactMode") === "true") {
                    container.classList.add("compacto");
                }
            } catch (err) {
                container.innerHTML = `<p style='color:red;'>Error al buscar</p>`;
                console.error(err);
            }
        }, 300);
    });
}

async function loadPage(page) {
    const container = document.querySelector(".container_cards");
    container.innerHTML = "<p>Cargando Pokémon...</p>";

    try {
        const offset = (page - 1) * perPage;
        const res = await fetch(`${POKE_URL}?limit=${perPage}&offset=${offset}`);
        const data = await res.json();

        container.innerHTML = "";
        for (const p of data.results) {
            const pokeData = await fetch(p.url).then(r => r.json());
            container.appendChild(createCard(pokeData));
        }

        setupPagination(data.count);
        const savedCompact = localStorage.getItem("compactMode") === "true";
        console.log("📦 compactMode al cargar página:", savedCompact);
        if (savedCompact) {
            container.classList.add("compacto");
            console.log("✅ Clase compacto aplicada al container");
        }

    } catch (err) {
        container.innerHTML = "<p>Error al cargar Pokémon</p>";
        console.error(err);
    }
}

let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

function createCard(poke) {
    const card = document.createElement("div");
    card.className = "card_pokemons";
    card.innerHTML = `
        <div class="img_card_pokemon">
            <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
        </div>
        <div class="info_poke">
            <div class="title_pokemon"><h2>${capitalize(poke.name)}</h2></div>
            <div class="id_pk"><h6>#${String(poke.id).padStart(3, '0')}</h6></div>
        </div>
    `;

    card.addEventListener('click', () => showPokemonDetails(poke));
    card.style.cursor = 'pointer';

    return card;
}

async function showPokemonDetails(poke) {
    const overlay = document.createElement('div');
    overlay.className = 'pokemon-overlay';

    const modal = document.createElement('div');
    modal.className = 'pokemon-modal';

    const isFavorite = favorites.some(fav => fav.id === poke.id);

    modal.innerHTML = `
        <button class="close-btn">&times;</button>
        
        <div class="modal-header">
            <div class="header-title">
                <h1>${capitalize(poke.name)} <span class="pokemon-id">#${String(poke.id).padStart(3, '0')}</span></h1>
            </div>
            
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-pokemon-id="${poke.id}">
                <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>${isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}</span>
            </button>
        </div>
        
        <div class="modal-body">
            <div class="modal-left">
                <div class="pokemon-image-container">
                    <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
                </div>
                
                <div class="pokemon-types">
                    ${poke.types.map(t => `
                        <span class="type-badge type-${t.type.name}">
                            ${translateType(t.type.name)}
                        </span>
                    `).join('')}
                </div>
                
                <div class="pokemon-physical">
                    <div class="physical-item">
                        <span class="label">ALTURA</span>
                        <span class="value">${(poke.height / 10).toFixed(1)} m</span>
                    </div>
                    <div class="physical-item">
                        <span class="label">PESO</span>
                        <span class="value">${(poke.weight / 10).toFixed(1)} kg</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-right">
                <div class="stats-section">
                    <h3>Estadísticas Base</h3>
                    <div class="stats-grid2">
                        ${poke.stats.map(s => {
                            const statName = translateStat(s.stat.name);
                            const statValue = s.base_stat;
                            const percentage = (statValue / 255) * 100;
                            return `
                                <div class="stat-row">
                                    <span class="stat-name">${statName}</span>
                                    <span class="stat-value">${statValue}</span>
                                    <div class="stat-bar">
                                        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="stat-total">
                        <span class="total-label">Total</span>
                        <span class="total-value">${poke.stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
                    </div>
                </div>
                
                <div class="abilities-section">
                    <h3>Habilidades</h3>
                    <div class="abilities-grid">
                        ${poke.abilities.map(a => `
                            <div class="ability-item ${a.is_hidden ? 'hidden' : ''}">
                                <span class="ability-name">${capitalize(a.ability.name.replace('-', ' '))}</span>
                                ${a.is_hidden ? '<span class="hidden-badge">OCULTA</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('active'), 10);

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => closeModal(overlay));

    const favoriteBtn = modal.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => toggleFavorite(poke, favoriteBtn));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function toggleFavorite(poke, button) {
    const index = favorites.findIndex(fav => fav.id === poke.id);

    if (index !== -1) {
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.querySelector('span').textContent = 'Agregar a Favoritos';
        showNotification('❌ Eliminado de favoritos');
    } else {
        favorites.push({
            id: poke.id,
            name: poke.name,
            image: poke.sprites.other['official-artwork'].front_default
        });
        button.classList.add('active');
        button.querySelector('span').textContent = 'Quitar de Favoritos';
        showNotification('⭐ Agregado a favoritos');
    }

    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function translateType(type) {
    const types = {
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    return types[type] || type.toUpperCase();
}

function translateStat(stat) {
    const stats = {
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'At. Especial',
        'special-defense': 'Def. Especial',
        'speed': 'Velocidad'
    };
    return stats[stat] || stat;
}

function closeModal(overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupPagination(total) {
    const numbers = document.querySelector(".numbers");
    numbers.innerHTML = `Page ${currentPage} / ${Math.ceil(total / perPage)}`;
}