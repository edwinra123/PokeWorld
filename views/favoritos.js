import { navigateTo } from '../assets/routes.js';

const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

export function renderFavoritos() {
    const main = document.getElementById("main-content");

    main.innerHTML = `
        <div class="favorites-page">
            <div class="favorites-header">
                <h1>Mis Colecciones</h1>
                <h3>Gestiona y visualiza tus pokemones favoritos.</h3>
            </div>
            <div class="banner_vz">
            <div class="cap_pk">
                <h2>Favoritos</h2>
                <div class="favorites-count">
                <span class="tl_pk">${favorites.length}</span>
                </div>
                <div class="pk_bottom">
                    <span><i class="fa-solid fa-heart"></i> Coleccion principal</span>
                </div>
            </div>
            </div>
            <div class="header_top_favorites">
            <h2>Pokemones favoritos</h2>
            </div>
            <div id="favorites-container" class="favorites-grid">
            </div>
            
           <div id="empty-state" class="empty-state" style="display: none;">
    <svg class="logo_empty" width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="#ccc"
              stroke-width="1.5"
              fill="none"/>
    </svg>
    <div class="text_state">
        <h2>No tienes favoritos aún</h2>
        <p>Explora la Pokédex y agrega tus Pokémon favoritos para verlos aquí</p>
    </div>
    <button class="btn-explore">Explorar Pokédex</button>
</div>
        </div>
    `;

    loadFavoritesContent();
}

async function loadFavoritesContent() {
    const container = document.getElementById('favorites-container');
    const emptyState = document.getElementById('empty-state');
    favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

    if (favorites.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        document.querySelector('.btn-explore').addEventListener('click', () => {
            navigateTo('pokelista');
        });

        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '<div class="loading">Cargando favoritos...</div>';

    const pokemonCards = [];

    for (const fav of favorites) {
        try {
            const response = await fetch(`${POKE_URL}/${fav.id}`);
            const poke = await response.json();
            const card = createFavoriteCard(poke);
            pokemonCards.push(card);
        } catch (error) {
            console.error('Error cargando pokemon:', error);
        }
    }

    container.innerHTML = '';
    pokemonCards.forEach(card => container.appendChild(card));
}

function createFavoriteCard(poke) {
    const card = document.createElement("div");
    card.className = "favorite-card";
        const isDark = localStorage.getItem("darkMode") === "true";

    card.innerHTML = `
        <button class="remove-favorite" data-pokemon-id="${poke.id}" title="Quitar de favoritos">
        </button>
        
        <div class="favorite-card-image" style="background: ${isDark ? '#1a1a20' : 'white'};">  <!-- 👈 agrega el style -->
            <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
        </div>
        <div class="favorite-card-info">
            <span class="pokemon-number">#${String(poke.id).padStart(3,'0')}</span>
            <h3>${capitalize(poke.name)}</h3>
        </div>
        
        <div class="favorite-card-types">
            ${poke.types.map(t => `
                <span class="type-badge type-${t.type.name}">
                    ${translateType(t.type.name)}
                </span>
            `).join('')}
        </div>
        
        <div class="favorite-card-stats">
            <div class="stat-item">
                <span>⚡</span>
                <span>CP <span class="stat-value">${poke.base_experience || '???'}</span></span>
            </div>
            <div class="stat-item">
                <span>⚖️</span>
                <span><span class="stat-value">${(poke.weight / 10).toFixed(1)}</span> kg</span>
            </div>
        </div>
    `;
    
    const removeBtn = card.querySelector('.remove-favorite');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFavorite(poke.id, card);
    });
    
    card.addEventListener('click', () => showPokemonDetails(poke));
    
    return card;
}

function removeFavorite(pokemonId, cardElement) {
    favorites = favorites.filter(fav => fav.id !== pokemonId);
    
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    
    cardElement.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
        cardElement.remove();
        
        const countElement = document.querySelector('.favorites-count span');
        if (countElement) {
            countElement.textContent = favorites.length;
        }
        
        if (favorites.length === 0) {
            document.getElementById('favorites-container').style.display = 'none';
            document.getElementById('empty-state').style.display = 'flex';
        }
    }, 300);
    
    showNotification('❌ Pokémon eliminado de favoritos');
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
            <h1>${capitalize(poke.name)} <span class="pokemon-id">#${String(poke.id).padStart(3,'0')}</span></h1>
            
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
                        <span class="label">Altura</span>
                        <span class="value">${(poke.height / 10).toFixed(1)} m</span>
                    </div>
                    <div class="physical-item">
                        <span class="label">Peso</span>
                        <span class="value">${(poke.weight / 10).toFixed(1)} kg</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-right">
                <div class="stats-section">
                    <h3>Estadísticas Base</h3>
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
                    <div class="stat-total">
                        <span>Total</span>
                        <span class="total-value">${poke.stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
                    </div>
                </div>
                
                <div class="abilities-section">
                    <h3>Habilidades</h3>
                    ${poke.abilities.map(a => `
                        <div class="ability-item">
                            <span class="ability-name">${capitalize(a.ability.name.replace('-', ' '))}</span>
                            ${a.is_hidden ? '<span class="hidden-badge">OCULTA</span>' : ''}
                        </div>
                    `).join('')}
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
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(poke, favoriteBtn);
        setTimeout(() => {
            loadFavoritesContent();
        }, 500);
    });
    
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
    favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
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
        'normal': 'Normal', 'fire': 'Fuego', 'water': 'Agua', 'grass': 'Planta',
        'electric': 'Eléctrico', 'ice': 'Hielo', 'fighting': 'Lucha', 'poison': 'Veneno',
        'ground': 'Tierra', 'flying': 'Volador', 'psychic': 'Psíquico', 'bug': 'Bicho',
        'rock': 'Roca', 'ghost': 'Fantasma', 'dragon': 'Dragón', 'dark': 'Siniestro',
        'steel': 'Acero', 'fairy': 'Hada'
    };
    return types[type] || type.toUpperCase();
}

function translateStat(stat) {
    const stats = {
        'hp': 'PS', 'attack': 'Ataque', 'defense': 'Defensa',
        'special-attack': 'At. Especial', 'special-defense': 'Def. Especial', 'speed': 'Velocidad'
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