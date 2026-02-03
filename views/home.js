const POKE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

export async function renderHome() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <section class="hero-banner">
            <div class="hero-content">
                <h2 class="hero-title">Descubre el mundo<br>Pokémon</h2>
                <p class="hero-description">
                    Explore mas de 1000+ Pokémones con estadísticas detalladas, habilidades, y evoluciones.
                </p>
                <button class="hero-btn">Explora Ahora!</button>
            </div>
            <div class="hero-pikachu">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu">
            </div>
        </section>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                    <i class="fas fa-database"></i>
                </div>
                <div class="stat-info">
                    <p class="stat-number">1,025</p>
                    <p class="stat-label">Pokémones</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                    <i class="fas fa-shapes"></i>
                </div>
                <div class="stat-info">
                    <p class="stat-number">18</p>
                    <p class="stat-label">Tipos</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #a855f7, #9333ea);">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="stat-info">
                    <p class="stat-number">9</p>
                    <p class="stat-label">Generaciones</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f97316, #ea580c);">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="stat-info">
                    <p class="stat-number">59</p>
                    <p class="stat-label">Habilidades</p>
                </div>
            </div>
        </div>

        <section class="types-section">
            <div class="section-header">
                <h3 class="section-title-main">Pokémon Tipos</h3>
            </div>
        </section>

        <section class="pokemon-section">
            <div class="section-header">
                <h3 class="section-title-main">Featured Pokémon</h3>
            </div>
            <div class="container_cards"></div>
        </section>
    `;

    const container = main.querySelector(".container_cards");
    container.innerHTML = "<p>Cargando Pokémon...</p>";

    try {
        const res = await fetch(POKE_URL);
        const data = await res.json();

        container.innerHTML = "";
        for (const p of data.results) {
            const pokeData = await fetch(p.url).then(r => r.json());
            container.appendChild(createCard(pokeData));
        }
    } catch (err) {
        container.innerHTML = "<p>Error al cargar Pokémon</p>";
        console.error(err);
    }
}

function createCard(poke) {
    const card = document.createElement("div");
    card.className = "card_pokemons";
    card.innerHTML = `
        <div class="img_card_pokemon">
            <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
        </div>
        <div class="info_poke">
            <div class="title_pokemon"><h2>${capitalize(poke.name)}</h2></div>
            <div class="id_pk"><h6>#${String(poke.id).padStart(3,'0')}</h6></div>
        </div>
    `;
    return card;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
