import { navigateTo } from "../assets/routes.js";
import {
    getFavorites, saveFavorites, showPokemonDetails,
    showNotification, capitalize, padId, translateType,
} from "../assets/utils.js";

const POKE_URL = "https://pokeapi.co/api/v2/pokemon";

export function renderFavoritos() {
    const main = document.getElementById("main-content");
    const favorites = getFavorites();

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
            <div id="favorites-container" class="favorites-grid"></div>
            <div id="empty-state" class="empty-state" style="display:none;">
                <svg class="logo_empty" width="120" height="120" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          stroke="#ccc" stroke-width="1.5" fill="none"/>
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
    const container = document.getElementById("favorites-container");
    const emptyState = document.getElementById("empty-state");
    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.style.display = "none";
        emptyState.style.display = "flex";
        document.querySelector(".btn-explore").addEventListener("click", () => navigateTo("pokelista"));
        return;
    }

    container.style.display = "grid";
    emptyState.style.display = "none";
    container.innerHTML = '<div class="loading">Cargando favoritos...</div>';

    // ✅ Peticiones en paralelo
    const results = await Promise.allSettled(
        favorites.map((fav) => fetch(`${POKE_URL}/${fav.id}`).then((r) => r.json()))
    );

    container.innerHTML = "";
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            container.appendChild(createFavoriteCard(result.value));
        }
    });

    // Actualizar contador
    const countEl = document.querySelector(".tl_pk");
    if (countEl) countEl.textContent = getFavorites().length;
}

function createFavoriteCard(poke) {
    const card = document.createElement("div");
    card.className = "favorite-card";

    card.innerHTML = `
        <button class="remove-favorite" data-pokemon-id="${poke.id}" title="Quitar de favoritos"></button>
        <div class="favorite-card-image">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="favorite-card-info">
            <span class="pokemon-number">${padId(poke.id)}</span>
            <h3>${capitalize(poke.name)}</h3>
        </div>
        <div class="favorite-card-types">
            ${poke.types.map((t) => `
                <span class="type-badge type-${t.type.name}">${translateType(t.type.name)}</span>
            `).join("")}
        </div>
        <div class="favorite-card-stats">
            <div class="stat-item">
                <span>⚡</span>
                <span>CP <span class="stat-value">${poke.base_experience || "???"}</span></span>
            </div>
            <div class="stat-item">
                <span>⚖️</span>
                <span><span class="stat-value">${(poke.weight / 10).toFixed(1)}</span> kg</span>
            </div>
        </div>
    `;

    card.querySelector(".remove-favorite").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFavorite(poke.id, card);
    });

    card.addEventListener("click", () =>
        showPokemonDetails(poke, () => loadFavoritesContent())
    );

    return card;
}

function removeFavorite(pokemonId, cardElement) {
    let favorites = getFavorites();
    favorites = favorites.filter((f) => f.id !== pokemonId);
    saveFavorites(favorites);

    cardElement.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => {
        cardElement.remove();

        const countEl = document.querySelector(".tl_pk");
        if (countEl) countEl.textContent = favorites.length;

        if (favorites.length === 0) {
            document.getElementById("favorites-container").style.display = "none";
            document.getElementById("empty-state").style.display = "flex";
        }
    }, 300);

    showNotification("❌ Pokémon eliminado de favoritos");
}
