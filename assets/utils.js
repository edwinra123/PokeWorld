// ─── Traducciones ────────────────────────────────────────────────────────────

export function translateType(type) {
    const types = {
        normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta",
        electric: "Eléctrico", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
        ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
        rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
        steel: "Acero", fairy: "Hada",
    };
    return types[type] || type.toUpperCase();
}

export function translateStat(stat) {
    const stats = {
        hp: "PS", attack: "Ataque", defense: "Defensa",
        "special-attack": "At. Especial", "special-defense": "Def. Especial",
        speed: "Velocidad",
    };
    return stats[stat] || stat;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function padId(id) {
    return "#" + String(id).padStart(3, "0");
}

// ─── Favoritos (localStorage) ─────────────────────────────────────────────────

export function getFavorites() {
    return JSON.parse(localStorage.getItem("pokemonFavorites")) || [];
}

export function saveFavorites(favs) {
    localStorage.setItem("pokemonFavorites", JSON.stringify(favs));
}

export function toggleFavorite(poke, button) {
    let favorites = getFavorites();
    const index = favorites.findIndex((f) => f.id === poke.id);

    if (index !== -1) {
        favorites.splice(index, 1);
        button.classList.remove("active");
        button.querySelector("span").textContent = "Agregar a Favoritos";
        showNotification("❌ Eliminado de favoritos");
    } else {
        favorites.push({
            id: poke.id,
            name: poke.name,
            image: poke.sprites.other["official-artwork"].front_default,
        });
        button.classList.add("active");
        button.querySelector("span").textContent = "Quitar de Favoritos";
        showNotification("⭐ Agregado a favoritos");
    }

    saveFavorites(favorites);
}

// ─── Notificación ─────────────────────────────────────────────────────────────

export function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ─── Modal de detalles ────────────────────────────────────────────────────────

export function closeModal(overlay) {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
}

export function showPokemonDetails(poke, onFavoriteChange) {
    const favorites = getFavorites();
    const isFavorite = favorites.some((f) => f.id === poke.id);

    const overlay = document.createElement("div");
    overlay.className = "pokemon-overlay";

    const modal = document.createElement("div");
    modal.className = "pokemon-modal";

    modal.innerHTML = `
        <button class="close-btn">&times;</button>

        <div class="modal-header">
            <div class="header-title">
                <h1>${capitalize(poke.name)} <span class="pokemon-id">${padId(poke.id)}</span></h1>
            </div>
            <button class="favorite-btn ${isFavorite ? "active" : ""}" data-pokemon-id="${poke.id}">
                <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>${isFavorite ? "Quitar de Favoritos" : "Agregar a Favoritos"}</span>
            </button>
        </div>

        <div class="modal-body">
            <div class="modal-left">
                <div class="pokemon-image-container">
                    <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
                </div>
                <div class="pokemon-types">
                    ${poke.types.map((t) => `
                        <span class="type-badge type-${t.type.name}">${translateType(t.type.name)}</span>
                    `).join("")}
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
                        ${poke.stats.map((s) => {
                            const pct = ((s.base_stat / 255) * 100).toFixed(1);
                            return `
                            <div class="stat-row">
                                <span class="stat-name">${translateStat(s.stat.name)}</span>
                                <span class="stat-value">${s.base_stat}</span>
                                <div class="stat-bar">
                                    <div class="stat-bar-fill" style="width:${pct}%"></div>
                                </div>
                            </div>`;
                        }).join("")}
                    </div>
                    <div class="stat-total">
                        <span class="total-label">Total</span>
                        <span class="total-value">${poke.stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
                    </div>
                </div>

                <div class="abilities-section">
                    <h3>Habilidades</h3>
                    <div class="abilities-grid">
                        ${poke.abilities.map((a) => `
                            <div class="ability-item ${a.is_hidden ? "hidden" : ""}">
                                <span class="ability-name">${capitalize(a.ability.name.replace(/-/g, " "))}</span>
                                ${a.is_hidden ? '<span class="hidden-badge">OCULTA</span>' : ""}
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add("active"), 10);

    modal.querySelector(".close-btn").addEventListener("click", () => closeModal(overlay));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(overlay); });

    modal.querySelector(".favorite-btn").addEventListener("click", (e) => {
        toggleFavorite(poke, e.currentTarget);
        if (onFavoriteChange) onFavoriteChange();
    });

    document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
            closeModal(overlay);
            document.removeEventListener("keydown", escHandler);
        }
    });
}
