const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 1;
const perPage = 20;

export function renderPokeLista() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <div class ="div-search">
        g
        </div>
        <section class="pokemon-list-section">
            <h2>Todos los Pokémon</h2>
            <div class="container_cards"></div>
            <div class="pagination-container">
                <button class="pagination-btn prev">Previous</button>
                <div class="numbers"></div>
                <button class="pagination-btn next">Next</button>
            </div>
        </section>
    `;

    loadPage(currentPage);

    document.querySelector(".prev").addEventListener("click", () => {
        if(currentPage > 1) loadPage(--currentPage);
    });
    document.querySelector(".next").addEventListener("click", () => {
        loadPage(++currentPage);
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

function setupPagination(total) {
    const numbers = document.querySelector(".numbers");
    numbers.innerHTML = `Page ${currentPage} / ${Math.ceil(total/perPage)}`;
}
